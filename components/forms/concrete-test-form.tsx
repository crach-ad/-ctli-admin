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
import type { ConcreteTestSubform } from "@/lib/types";

const lookupConfigs = [
  { table: "project_name", column: "projectname" },
  { table: "typebreak", column: "typebreak" },
];

interface Props {
  initialData?: ConcreteTestSubform;
  basePath?: string;
  onSaved?: () => void;
}

export function ConcreteTestForm({ initialData, basePath = "/concrete-tests", onSaved }: Props) {
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
    castdate: initialData?.castdate?.split("T")[0] ?? "",
    testdate: initialData?.testdate?.split("T")[0] ?? "",
    ageofcylinder: initialData?.ageofcylinder?.toString() ?? "",
    slumpin: initialData?.slumpin ?? "",
    truckno: initialData?.truckno ?? "",
    crosssecareascylin: initialData?.crosssecareascylin ?? "",
    typecylindersize: initialData?.typecylindersize ?? "",
    weightcylinder: initialData?.weightcylinder ?? "",
    densitycylinder: initialData?.densitycylinder ?? "",
    maxload_lbs: initialData?.maxload_lbs ?? "",
    compressivestrength_psi: initialData?.compressivestrength_psi ?? "",
    typebreak: initialData?.typebreak ?? "",
    mixdesign28days: initialData?.mixdesign28days ?? "",
    concretesupplier: initialData?.concretesupplier ?? "",
    datasheet_recorder: initialData?.datasheet_recorder ?? "",
    gridline_location: initialData?.gridline_location ?? "",
    cylinders_casted_by: initialData?.cylinders_casted_by ?? "",
    area: initialData?.area ?? "",
  });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      ageofcylinder: form.ageofcylinder ? parseInt(form.ageofcylinder) : null,
      castdate: form.castdate || null,
      testdate: form.testdate || null,
    };

    let error;
    if (initialData) {
      ({ error } = await supabase
        .from("tblconcretetestsubform")
        .update(payload)
        .eq("id", initialData.id));
    } else {
      const coords = geo.latitude != null ? { latitude: geo.latitude, longitude: geo.longitude } : {};
      ({ error } = await supabase
        .from("tblconcretetestsubform")
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
        <CardTitle>{isEdit ? "Edit" : "New"} Concrete Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField label="Project" value={form.projectname} onValueChange={(v) => update("projectname", v)} options={lookups.project_name ?? []} placeholder="Select project" />
            <InputField label="Location" value={form.structurepourlocation2} onChange={(v) => update("structurepourlocation2", v)} />
            <InputField label="Cast Date" type="date" value={form.castdate} onChange={(v) => update("castdate", v)} />
            <InputField label="Test Date" type="date" value={form.testdate} onChange={(v) => update("testdate", v)} />
            <InputField label="Age of Cylinder (days)" type="number" value={form.ageofcylinder} onChange={(v) => update("ageofcylinder", v)} />
            <InputField label="Slump (in)" value={form.slumpin} onChange={(v) => update("slumpin", v)} />
            <InputField label="Truck No" value={form.truckno} onChange={(v) => update("truckno", v)} />
            <InputField label="Cross Sectional Area" value={form.crosssecareascylin} onChange={(v) => update("crosssecareascylin", v)} />
            <InputField label="Cylinder Size" value={form.typecylindersize} onChange={(v) => update("typecylindersize", v)} />
            <InputField label="Weight" value={form.weightcylinder} onChange={(v) => update("weightcylinder", v)} />
            <InputField label="Density" value={form.densitycylinder} onChange={(v) => update("densitycylinder", v)} />
            <InputField label="Max Load (lbs)" value={form.maxload_lbs} onChange={(v) => update("maxload_lbs", v)} />
            <InputField label="Compressive Strength (PSI)" value={form.compressivestrength_psi} onChange={(v) => update("compressivestrength_psi", v)} />
            <SelectField label="Type of Break" value={form.typebreak} onValueChange={(v) => update("typebreak", v)} options={lookups.typebreak ?? []} placeholder="Select type" />
            <InputField label="Mix Design 28 Days" value={form.mixdesign28days} onChange={(v) => update("mixdesign28days", v)} />
            <InputField label="Supplier" value={form.concretesupplier} onChange={(v) => update("concretesupplier", v)} />
            <InputField label="Recorder" value={form.datasheet_recorder} onChange={(v) => update("datasheet_recorder", v)} />
            <InputField label="Gridline Location" value={form.gridline_location} onChange={(v) => update("gridline_location", v)} />
            <InputField label="Casted By" value={form.cylinders_casted_by} onChange={(v) => update("cylinders_casted_by", v)} />
            <InputField label="Area" value={form.area} onChange={(v) => update("area", v)} />
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
