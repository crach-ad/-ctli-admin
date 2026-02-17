"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { useGeolocation } from "@/lib/hooks/use-geolocation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputField, SelectField } from "@/components/form-field";
import { useLookups } from "@/lib/hooks/use-lookups";
import type { ConcreteField } from "@/lib/types";

const lookupConfigs = [
  { table: "project_name", column: "projectname" },
  { table: "structurepourlocation2", column: "structurepourlocation2" },
  { table: "readymixcompany", column: "readymixcompany" },
  { table: "datasheetrecorder", column: "datasheetrecorder" },
];

interface Props {
  initialData?: ConcreteField;
  basePath?: string;
  onSaved?: () => void;
}

export function ConcreteFieldForm({ initialData, basePath = "/concrete-field", onSaved }: Props) {
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
    fieldinspectiondate: initialData?.fieldinspectiondate?.split("T")[0] ?? "",
    structurepourlocation2: initialData?.structurepourlocation2 ?? "",
    concretesupplier: initialData?.concretesupplier ?? "",
    datasheet_recorder: initialData?.datasheet_recorder ?? "",
    datasheetno: initialData?.datasheetno ?? "",
    spc_yds: initialData?.spc_yds?.toString() ?? "",
    act_yds: initialData?.act_yds?.toString() ?? "",
    timeonsite: initialData?.timeonsite ?? "",
    timepourfinished: initialData?.timepourfinished ?? "",
    airtemp_f: initialData?.airtemp_f ?? "",
    unitweight_lbs_ft: initialData?.unitweight_lbs_ft ?? "",
    remarks: initialData?.remarks ?? "",
  });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      spc_yds: form.spc_yds ? parseInt(form.spc_yds) : null,
      act_yds: form.act_yds ? parseInt(form.act_yds) : null,
      fieldinspectiondate: form.fieldinspectiondate || null,
    };

    let error;
    if (initialData) {
      ({ error } = await supabase
        .from("tblconcretefield")
        .update(payload)
        .eq("id", initialData.id));
    } else {
      const coords = geo.latitude != null ? { latitude: geo.latitude, longitude: geo.longitude } : {};
      ({ error } = await supabase
        .from("tblconcretefield")
        .insert({ ...payload, ...coords, entry_date: new Date().toISOString(), created_by: user?.id }));
    }

    setSaving(false);
    if (error) {
      alert("Error saving: " + error.message);
    } else if (onSaved) {
      onSaved();
    } else {
      router.push(initialData ? `${basePath}/${initialData.id}` : basePath);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit" : "New"} Field Inspection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Project" value={form.projectname} onValueChange={(v) => update("projectname", v)} options={lookups.project_name ?? []} placeholder="Select project" />
            <InputField label="Inspection Date" type="date" value={form.fieldinspectiondate} onChange={(v) => update("fieldinspectiondate", v)} />
            <SelectField label="Location" value={form.structurepourlocation2} onValueChange={(v) => update("structurepourlocation2", v)} options={lookups.structurepourlocation2 ?? []} placeholder="Select location" />
            <SelectField label="Supplier" value={form.concretesupplier} onValueChange={(v) => update("concretesupplier", v)} options={lookups.readymixcompany ?? []} placeholder="Select supplier" />
            <SelectField label="Recorder" value={form.datasheet_recorder} onValueChange={(v) => update("datasheet_recorder", v)} options={lookups.datasheetrecorder ?? []} placeholder="Select recorder" />
            <InputField label="Datasheet No" value={form.datasheetno} onChange={(v) => update("datasheetno", v)} />
            <InputField label="Specified Yards" type="number" value={form.spc_yds} onChange={(v) => update("spc_yds", v)} />
            <InputField label="Actual Yards" type="number" value={form.act_yds} onChange={(v) => update("act_yds", v)} />
            <InputField label="Time on Site" value={form.timeonsite} onChange={(v) => update("timeonsite", v)} />
            <InputField label="Pour Finished" value={form.timepourfinished} onChange={(v) => update("timepourfinished", v)} />
            <InputField label="Air Temp (F)" value={form.airtemp_f} onChange={(v) => update("airtemp_f", v)} />
            <InputField label="Unit Weight (lbs/ft)" value={form.unitweight_lbs_ft} onChange={(v) => update("unitweight_lbs_ft", v)} />
          </div>
          <div className="space-y-2">
            <Label>Remarks</Label>
            <Textarea value={form.remarks} onChange={(e) => update("remarks", e.target.value)} />
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
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Inspection"}
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
