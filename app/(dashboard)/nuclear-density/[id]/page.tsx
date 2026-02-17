"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/data-table";
import { DetailRow } from "@/components/detail-row";
import { RoleGate } from "@/components/role-gate";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { ArrowLeft, Pencil } from "lucide-react";
import { DetailSkeleton } from "@/components/detail-skeleton";
import { LocationMap } from "@/components/location-map";
import type { NuclearDensity, NuclearDensitySubform } from "@/lib/types";

const subformColumns: Column<NuclearDensitySubform>[] = [
  { key: "testno", label: "Test No" },
  { key: "wd", label: "WD" },
  { key: "dd", label: "DD" },
  { key: "m", label: "M" },
  { key: "m_pct", label: "M %" },
  { key: "compaction_pct", label: "Compaction %" },
  { key: "depth", label: "Depth" },
];

export default function NuclearDensityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<NuclearDensity | null>(null);
  const [subforms, setSubforms] = useState<NuclearDensitySubform[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [main, sub] = await Promise.all([
        supabase.from("tblnucleardensity").select("*").eq("id", id).single(),
        supabase.from("tblnucleardensitysubform").select("*").eq("id", id),
      ]);
      setRecord(main.data);
      setSubforms(sub.data ?? []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <DetailSkeleton rows={15} />;
  if (!record) return <p>Record not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <PdfDownloadButton
            fileName={`nuclear-density-${record.id}.pdf`}
            generateDocument={async () => {
              const { NuclearDensityReport } = await import("@/lib/pdf/nuclear-density-report");
              const { createElement } = await import("react");
              return createElement(NuclearDensityReport, { record, subforms });
            }}
          />
          <RoleGate allowedRoles={["admin", "field_inspector"]}>
            <Button onClick={() => router.push(`/nuclear-density/${id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Button>
          </RoleGate>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuclear Density Test #{record.id}</CardTitle>
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
          <DetailRow label="Time on Site" value={record.timeonsite} />
          <DetailRow label="Weather (Present)" value={record.weatherpresentday} />
          <DetailRow label="Weather (Previous)" value={record.weatherpreviousday} />
          <DetailRow label="Client Representative" value={record.client_representative} />
          <DetailRow label="Recorder" value={record.datasheet_recorder} />
          <DetailRow label="Trench" value={record.trench ? "Yes" : "No"} />
          <DetailRow label="Road" value={record.road ? "Yes" : "No"} />
          <DetailRow label="Foundation" value={record.foundation ? "Yes" : "No"} />
          <DetailRow label="Proctor" value={record.proctor} />
          <DetailRow label="Moisture" value={record.moisture} />
          <DetailRow
            label="Compaction"
            value={
              record.comppass ? (
                <Badge variant="default">Pass</Badge>
              ) : record.compfail ? (
                <Badge variant="destructive">Fail</Badge>
              ) : (
                "—"
              )
            }
          />
          <DetailRow
            label="Moisture Result"
            value={
              record.moisturepass ? (
                <Badge variant="default">Pass</Badge>
              ) : record.moisturefail ? (
                <Badge variant="destructive">Fail</Badge>
              ) : (
                "—"
              )
            }
          />
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
          <CardTitle>Test Readings ({subforms.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={subforms} columns={subformColumns} />
        </CardContent>
      </Card>
    </div>
  );
}
