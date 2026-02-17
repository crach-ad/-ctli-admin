"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailRow } from "@/components/detail-row";
import { PdfDownloadButton } from "@/components/pdf-download-button";
import { ArrowLeft, Pencil } from "lucide-react";
import { LocationMap } from "@/components/location-map";
import type { ConcreteTestSubform } from "@/lib/types";

export default function StaffConcreteTestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [record, setRecord] = useState<ConcreteTestSubform | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (authLoading || !user) return;
    async function load() {
      const { data } = await supabase
        .from("tblconcretetestsubform")
        .select("*")
        .eq("id", id)
        .eq("created_by", user!.id)
        .single();
      setRecord(data);
      setLoading(false);
    }
    load();
  }, [id, user, authLoading]);

  if (loading || authLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (!record) return <p>Record not found or access denied.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <PdfDownloadButton
            fileName={`concrete-test-${record.id}.pdf`}
            generateDocument={async () => {
              const { ConcreteTestReport } = await import("@/lib/pdf/concrete-test-report");
              const { createElement } = await import("react");
              return createElement(ConcreteTestReport, { record });
            }}
          />
          <Button onClick={() => router.push(`/staff/concrete-tests/${id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Concrete Test #{record.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailRow label="Project" value={record.projectname} />
          <DetailRow label="Location" value={record.structurepourlocation2} />
          <DetailRow label="Location (Other)" value={record.structurepourlocationother} />
          <DetailRow label="Cast Date" value={record.castdate ? new Date(record.castdate).toLocaleDateString() : null} />
          <DetailRow label="Test Date" value={record.testdate ? new Date(record.testdate).toLocaleDateString() : null} />
          <DetailRow label="Age of Cylinder" value={record.ageofcylinder} />
          <DetailRow label="Slump (in)" value={record.slumpin} />
          <DetailRow label="Truck No" value={record.truckno} />
          <DetailRow label="Cross Section Area" value={record.crosssecareascylin} />
          <DetailRow label="Cylinder Size" value={record.typecylindersize} />
          <DetailRow label="Weight" value={record.weightcylinder} />
          <DetailRow label="Density" value={record.densitycylinder} />
          <DetailRow label="Max Load (lbs)" value={record.maxload_lbs} />
          <DetailRow label="Compressive Strength (PSI)" value={record.compressivestrength_psi} />
          <DetailRow label="Type of Break" value={record.typebreak} />
          <DetailRow label="Mix Design 28 Days" value={record.mixdesign28days} />
          <DetailRow label="Supplier" value={record.concretesupplier} />
          <DetailRow label="Gridline Location" value={record.gridline_location} />
          <DetailRow label="Casted By" value={record.cylinders_casted_by} />
          <DetailRow label="Recorder" value={record.datasheet_recorder} />
          <DetailRow label="Area" value={record.area} />
          <DetailRow label="Cast 7 Day" value={record.cast7day} />
          <DetailRow label="Cast 14 Day" value={record.cast14day} />
          <DetailRow label="Cast 28 Day" value={record.cast28day} />
          <DetailRow label="Cast 56 Day" value={record.cast56day} />
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
    </div>
  );
}
