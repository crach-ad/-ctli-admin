"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField, SelectField } from "@/components/form-field";
import { useLookups } from "@/lib/hooks/use-lookups";
import type { NuclearDensity } from "@/lib/types";

const lookupConfigs = [
  { table: "project_name", column: "projectname" },
  { table: "weather", column: "weather" },
  { table: "datasheetrecorder", column: "datasheetrecorder" },
];

interface Props {
  initialData?: NuclearDensity;
  basePath?: string;
  onSaved?: () => void;
}

export function NuclearDensityForm({ initialData, basePath = "/nuclear-density", onSaved }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();
  const { lookups } = useLookups(lookupConfigs);
  const [saving, setSaving] = useState(false);
  const isEdit = !!initialData;
  const geo = useGeolocation();

  useEffect(() => {
    if (!isEdit) geo.requestLocation();
  }, []);

  const [form, setForm] = useState({
    projectname: initialData?.projectname ?? "",
    structurepourlocation2: initialData?.structurepourlocation2 ?? "",
    fieldinspectiondate: initialData?.fieldinspectiondate?.split("T")[0] ?? "",
    timeonsite: initialData?.timeonsite ?? "",
    weatherpresentday: initialData?.weatherpresentday ?? "",
    weatherpreviousday: initialData?.weatherpreviousday ?? "",
    client_representative: initialData?.client_representative ?? "",
    datasheet_recorder: initialData?.datasheet_recorder ?? "",
    trench: initialData?.trench ?? false,
    road: initialData?.road ?? false,
    foundation: initialData?.foundation ?? false,
    proctor: initialData?.proctor ?? "",
    moisture: initialData?.moisture ?? "",
    comppass: initialData?.comppass ?? false,
    compfail: initialData?.compfail ?? false,
    moisturepass: initialData?.moisturepass ?? false,
    moisturefail: initialData?.moisturefail ?? false,
  });

  function update(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const compactionValue = form.comppass ? "pass" : form.compfail ? "fail" : "";
  const moistureValue = form.moisturepass ? "pass" : form.moisturefail ? "fail" : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.projectname) {
      toast.error("Project is required");
      return;
    }
    setSaving(true);

    const payload = {
      ...form,
      fieldinspectiondate: form.fieldinspectiondate || null,
    };

    let error;
    if (initialData) {
      ({ error } = await supabase
        .from("tblnucleardensity")
        .update(payload)
        .eq("id", initialData.id));
    } else {
      const coords = geo.latitude != null ? { latitude: geo.latitude, longitude: geo.longitude } : {};
      ({ error } = await supabase
        .from("tblnucleardensity")
        .insert({ ...payload, ...coords, entry_date: new Date().toISOString(), created_by: user?.id }));
    }

    setSaving(false);
    if (error) {
      toast.error("Error saving: " + error.message);
    } else if (onSaved) {
      onSaved();
    } else {
      router.push(initialData ? `${basePath}/${initialData.id}` : basePath);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit" : "New"} Nuclear Density Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Project" value={form.projectname} onValueChange={(v) => update("projectname", v)} options={lookups.project_name ?? []} placeholder="Select project" required />
            <InputField label="Inspection Date" type="date" value={form.fieldinspectiondate} onChange={(v) => update("fieldinspectiondate", v)} />
            <InputField label="Location" value={form.structurepourlocation2} onChange={(v) => update("structurepourlocation2", v)} />
            <InputField label="Time on Site" value={form.timeonsite} onChange={(v) => update("timeonsite", v)} />
            <SelectField label="Weather (Present)" value={form.weatherpresentday} onValueChange={(v) => update("weatherpresentday", v)} options={lookups.weather ?? []} placeholder="Select weather" />
            <SelectField label="Weather (Previous)" value={form.weatherpreviousday} onValueChange={(v) => update("weatherpreviousday", v)} options={lookups.weather ?? []} placeholder="Select weather" />
            <InputField label="Client Representative" value={form.client_representative} onChange={(v) => update("client_representative", v)} />
            <SelectField label="Recorder" value={form.datasheet_recorder} onValueChange={(v) => update("datasheet_recorder", v)} options={lookups.datasheetrecorder ?? []} placeholder="Select recorder" />
            <InputField label="Proctor" value={form.proctor} onChange={(v) => update("proctor", v)} />
            <InputField label="Moisture" value={form.moisture} onChange={(v) => update("moisture", v)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.trench} onChange={(e) => update("trench", e.target.checked)} className="rounded" />
              <span className="text-sm">Trench</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.road} onChange={(e) => update("road", e.target.checked)} className="rounded" />
              <span className="text-sm">Road</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.foundation} onChange={(e) => update("foundation", e.target.checked)} className="rounded" />
              <span className="text-sm">Foundation</span>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Compaction"
              value={compactionValue}
              onValueChange={(v) => {
                update("comppass", v === "pass");
                update("compfail", v === "fail");
              }}
              options={["pass", "fail"]}
              placeholder="Select result"
            />
            <SelectField
              label="Moisture Result"
              value={moistureValue}
              onValueChange={(v) => {
                update("moisturepass", v === "pass");
                update("moisturefail", v === "fail");
              }}
              options={["pass", "fail"]}
              placeholder="Select result"
            />
          </div>

          {!isEdit && (
            <p className="text-sm text-muted-foreground">
              {geo.loading
                ? "Capturing GPS location..."
                : geo.latitude != null
                ? `Location captured (${geo.latitude.toFixed(4)}, ${geo.longitude!.toFixed(4)})`
                : geo.error
                ? `Location unavailable: ${geo.error}`
                : "Requesting location..."}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={saving || !form.projectname}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Test"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
