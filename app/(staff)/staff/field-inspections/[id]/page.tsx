"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, Column } from "@/components/data-table";
import { DetailRow } from "@/components/detail-row";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { ArrowLeft, Pencil } from "lucide-react";
import { DetailSkeleton } from "@/components/detail-skeleton";
import { LocationMap } from "@/components/location-map";
import type { ConcreteField, ConcreteFieldSubform } from "@/lib/types";

const subformColumns: Column<ConcreteFieldSubform>[] = [
  { key: "truckno", label: "Truck No" },
  { key: "ticketno", label: "Ticket No" },
  { key: "deliverytime", label: "Delivery Time" },
  { key: "yards_per_truck", label: "Yards" },
  { key: "trucksequence", label: "Sequence" },
  { key: "slumpin", label: "Slump (in)" },
  { key: "conctemp_f", label: "Temp (F)" },
  { key: "cylno", label: "Cyl No" },
  { key: "cylsize", label: "Cyl Size" },
];

export default function StaffFieldInspectionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [record, setRecord] = useState<ConcreteField | null>(null);
  const [subforms, setSubforms] = useState<ConcreteFieldSubform[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (authLoading || !user) return;
    async function load() {
      const [main, sub] = await Promise.all([
        supabase
          .from("tblconcretefield")
          .select("*")
          .eq("id", id)
          .eq("created_by", user!.id)
          .single(),
        supabase.from("tblconcretefieldsubform").select("*").eq("id", id),
      ]);
      setRecord(main.data);
      setSubforms(sub.data ?? []);
      setLoading(false);
    }
    load();
  }, [id, user, authLoading]);

  if (loading || authLoading) return <DetailSkeleton rows={18} />;
  if (!record) return <p>Record not found or access denied.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <PdfDownloadButton
            fileName={`field-inspection-${record.id}.pdf`}
            generateDocument={async () => {
              const { ConcreteFieldReport } = await import("@/lib/pdf/concrete-field-report");
              const { createElement } = await import("react");
              return createElement(ConcreteFieldReport, { record, subforms });
            }}
          />
          <Button onClick={() => router.push(`/staff/field-inspections/${id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Field Inspection #{record.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow label="Project" value={record.projectname} />
          <DetailRow
            label="Inspection Date"
            value={
              record.fieldinspectiondate
                ? new Date(record.fieldinspectiondate).toLocaleDateString()
                : null
            }
          />
          <DetailRow label="Location" value={record.structurepourlocation2} />
          <DetailRow label="Location (Other)" value={record.structurepourlocationother} />
          <DetailRow label="Gridline A" value={record.gridlinesa} />
          <DetailRow label="Gridline 1" value={record.gridlines1} />
          <DetailRow label="Datasheet No" value={record.datasheetno} />
          <DetailRow label="Strength/Slump" value={record.concretestrength_slump} />
          <DetailRow label="PSI" value={record.psi} />
          <DetailRow label="INS" value={record.ins} />
          <DetailRow label="Supplier" value={record.concretesupplier} />
          <DetailRow label="Specified Yards" value={record.spc_yds} />
          <DetailRow label="Actual Yards" value={record.act_yds} />
          <DetailRow label="Recorder" value={record.datasheet_recorder} />
          <DetailRow label="Time on Site" value={record.timeonsite} />
          <DetailRow label="Pour Finished" value={record.timepourfinished} />
          <DetailRow label="Air Temp (F)" value={record.airtemp_f} />
          <DetailRow label="Unit Weight" value={record.unitweight_lbs_ft} />
          <DetailRow label="Remarks" value={record.remarks} />
          <DetailRow
            label="GPS Coordinates"
            value={record.latitude != null ? `${record.latitude.toFixed(6)}, ${record.longitude!.toFixed(6)}` : null}
          />
        </CardContent>
      </Card>

      {record.latitude != null && record.longitude != null && (
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <LocationMap latitude={record.latitude} longitude={record.longitude} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Truck Deliveries ({subforms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={subforms} columns={subformColumns} />
        </CardContent>
      </Card>
    </div>
  );
}
