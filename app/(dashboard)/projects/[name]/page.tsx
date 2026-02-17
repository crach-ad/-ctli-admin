"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, Column } from "@/components/data-table";
import { ArrowLeft, HardHat, FlaskConical, Atom } from "lucide-react";
import type { ConcreteField, ConcreteTestSubform, NuclearDensity } from "@/lib/types";

const fieldColumns: Column<ConcreteField>[] = [
  { key: "id", label: "ID" },
  {
    key: "fieldinspectiondate",
    label: "Date",
    render: (r) =>
      r.fieldinspectiondate ? new Date(r.fieldinspectiondate).toLocaleDateString() : "",
  },
  { key: "structurepourlocation2", label: "Location" },
  { key: "concretesupplier", label: "Supplier" },
  { key: "datasheet_recorder", label: "Recorder" },
];

const testColumns: Column<ConcreteTestSubform>[] = [
  { key: "id", label: "ID" },
  {
    key: "castdate",
    label: "Cast Date",
    render: (r) => (r.castdate ? new Date(r.castdate).toLocaleDateString() : ""),
  },
  {
    key: "testdate",
    label: "Test Date",
    render: (r) => (r.testdate ? new Date(r.testdate).toLocaleDateString() : ""),
  },
  { key: "ageofcylinder", label: "Age" },
  { key: "compressivestrength_psi", label: "Strength (PSI)" },
  { key: "typebreak", label: "Break Type" },
];

const nuclearColumns: Column<NuclearDensity>[] = [
  { key: "id", label: "ID" },
  {
    key: "fieldinspectiondate",
    label: "Date",
    render: (r) =>
      r.fieldinspectiondate ? new Date(r.fieldinspectiondate).toLocaleDateString() : "",
  },
  { key: "structurepourlocation2", label: "Location" },
  { key: "datasheet_recorder", label: "Recorder" },
];

export default function ProjectDetailPage() {
  const { name } = useParams();
  const router = useRouter();
  const projectName = decodeURIComponent(name as string);
  const supabase = createClient();

  const [fieldData, setFieldData] = useState<ConcreteField[]>([]);
  const [testData, setTestData] = useState<ConcreteTestSubform[]>([]);
  const [nuclearData, setNuclearData] = useState<NuclearDensity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [field, tests, nuclear] = await Promise.all([
        supabase
          .from("tblconcretefield")
          .select("*")
          .eq("projectname", projectName)
          .order("id", { ascending: false }),
        supabase
          .from("tblconcretetestsubform")
          .select("*")
          .eq("projectname", projectName)
          .order("id", { ascending: false }),
        supabase
          .from("tblnucleardensity")
          .select("*")
          .eq("projectname", projectName)
          .order("id", { ascending: false }),
      ]);
      setFieldData(field.data ?? []);
      setTestData(tests.data ?? []);
      setNuclearData(nuclear.data ?? []);
      setLoading(false);
    }
    load();
  }, [projectName]);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/projects")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Button>

      <h1 className="text-2xl font-bold">{projectName}</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Field Inspections</CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : fieldData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Concrete Tests</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : testData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nuclear Density</CardTitle>
            <Atom className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : nuclearData.length}</div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <Tabs defaultValue="field">
          <TabsList>
            <TabsTrigger value="field">Field Inspections ({fieldData.length})</TabsTrigger>
            <TabsTrigger value="tests">Concrete Tests ({testData.length})</TabsTrigger>
            <TabsTrigger value="nuclear">Nuclear Density ({nuclearData.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="field">
            <DataTable
              data={fieldData}
              columns={fieldColumns}
              onRowClick={(row) => router.push(`/concrete-field/${row.id}`)}
            />
          </TabsContent>
          <TabsContent value="tests">
            <DataTable
              data={testData}
              columns={testColumns}
              onRowClick={(row) => router.push(`/concrete-tests/${row.id}`)}
            />
          </TabsContent>
          <TabsContent value="nuclear">
            <DataTable
              data={nuclearData}
              columns={nuclearColumns}
              onRowClick={(row) => router.push(`/nuclear-density/${row.id}`)}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
