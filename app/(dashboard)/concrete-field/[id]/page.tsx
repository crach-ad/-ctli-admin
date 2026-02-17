"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, Column } from "@/components/data-table";
import { DetailRow } from "@/components/detail-row";
import { RoleGate } from "@/components/role-gate";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { ArrowLeft, Pencil } from "lucide-react";
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

export default function ConcreteFieldDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<ConcreteField | null>(null);
  const [subforms, setSubforms] = useState<ConcreteFieldSubform[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [main, sub] = await Promise.all([
        supabase.from("tblconcretefield").select("*").eq("id", id).single(),
        supabase.from("tblconcretefieldsubform").select("*").eq("id", id),
      ]);
      setRecord(main.data);
      setSubforms(sub.data ?? []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!record) return <p>Record not found.</p>;

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
          <RoleGate allowedRoles={["admin", "field_inspector"]}>
            <Button onClick={() => router.push(`/concrete-field/${id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
          </RoleGate>
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
