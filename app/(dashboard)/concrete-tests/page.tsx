"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DataTable, Column } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { RoleGate } from "@/components/role-gate";
import { FilterBar } from "@/components/filter-bar";
import { useFilters } from "@/lib/hooks/use-filters";
import { Plus } from "lucide-react";
import type { ConcreteTestSubform } from "@/lib/types";

const columns: Column<ConcreteTestSubform>[] = [
  { key: "id", label: "ID" },
  { key: "projectname", label: "Project" },
  {
    key: "castdate",
    label: "Cast Date",
    render: (row) =>
      row.castdate ? new Date(row.castdate).toLocaleDateString() : "",
  },
  {
    key: "testdate",
    label: "Test Date",
    render: (row) =>
      row.testdate ? new Date(row.testdate).toLocaleDateString() : "",
  },
  { key: "ageofcylinder", label: "Age (days)" },
  { key: "compressivestrength_psi", label: "Strength (PSI)" },
  { key: "typebreak", label: "Break Type" },
  { key: "concretesupplier", label: "Supplier" },
];

function ConcreteTestsPageInner() {
  const [data, setData] = useState<ConcreteTestSubform[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const { filters, setFilter, clearFilters, hasFilters } = useFilters();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tblconcretetestsubform")
        .select("*")
        .order("id", { ascending: false })
        .limit(500);
      setData(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = data;
    if (filters.project) {
      result = result.filter((r) => r.projectname === filters.project);
    }
    if (filters.dateFrom) {
      result = result.filter((r) => (r.castdate ?? "") >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((r) => (r.castdate ?? "") <= filters.dateTo);
    }
    return result;
  }, [data, filters]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Concrete Tests</h1>
        <RoleGate allowedRoles={["admin", "lab_technician"]}>
          <Button onClick={() => router.push("/concrete-tests/new")}>
            <Plus className="mr-2 h-4 w-4" /> New Test
          </Button>
        </RoleGate>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <DataTable
          data={filtered}
          columns={columns}
          searchKey="projectname"
          searchPlaceholder="Search by project..."
          onRowClick={(row) => router.push(`/concrete-tests/${row.id}`)}
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

export default function ConcreteTestsPage() {
  return (
    <Suspense>
      <ConcreteTestsPageInner />
    </Suspense>
  );
}
