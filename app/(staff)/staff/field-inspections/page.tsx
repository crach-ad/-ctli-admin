"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { DataTable, Column } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/filter-bar";
import { useFilters } from "@/lib/hooks/use-filters";
import { Plus } from "lucide-react";
import type { ConcreteField } from "@/lib/types";

const columns: Column<ConcreteField>[] = [
  { key: "id", label: "ID" },
  { key: "projectname", label: "Project" },
  {
    key: "fieldinspectiondate",
    label: "Inspection Date",
    render: (row) =>
      row.fieldinspectiondate
        ? new Date(row.fieldinspectiondate).toLocaleDateString()
        : "",
  },
  { key: "structurepourlocation2", label: "Location" },
  { key: "concretesupplier", label: "Supplier" },
  { key: "datasheet_recorder", label: "Recorder" },
];

function FieldInspectionsInner() {
  const [data, setData] = useState<ConcreteField[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { filters, setFilter, clearFilters, hasFilters } = useFilters();

  useEffect(() => {
    if (authLoading || !user) return;
    async function load() {
      const { data } = await supabase
        .from("tblconcretefield")
        .select("*")
        .eq("created_by", user!.id)
        .order("id", { ascending: false });
      setData(data ?? []);
      setLoading(false);
    }
    load();
  }, [user, authLoading]);

  const filtered = useMemo(() => {
    let result = data;
    if (filters.project) {
      result = result.filter((r) => r.projectname === filters.project);
    }
    if (filters.dateFrom) {
      result = result.filter((r) => (r.fieldinspectiondate ?? "") >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((r) => (r.fieldinspectiondate ?? "") <= filters.dateTo);
    }
    return result;
  }, [data, filters]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Field Inspections</h1>
        <Button onClick={() => router.push("/staff/field-inspections/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Inspection
        </Button>
      </div>
      {loading || authLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <DataTable
          data={filtered}
          columns={columns}
          searchKey="projectname"
          searchPlaceholder="Search by project..."
          onRowClick={(row) => router.push(`/staff/field-inspections/${row.id}`)}
          filterBar={
            <FilterBar
              filters={filters}
              onFilterChange={setFilter}
              onClear={clearFilters}
              hasFilters={hasFilters}
            />
          }
        />
      )}
    </div>
  );
}

export default function StaffFieldInspectionsPage() {
  return (
    <Suspense>
      <FieldInspectionsInner />
    </Suspense>
  );
}
