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

function ConcreteTestsInner() {
  const [data, setData] = useState<ConcreteTestSubform[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { filters, setFilter, clearFilters, hasFilters } = useFilters();

  useEffect(() => {
    if (authLoading || !user) return;
    async function load() {
      const { data } = await supabase
        .from("tblconcretetestsubform")
        .select("*")
        .eq("created_by", user!.id)
        .order("id", { ascending: false })
        .limit(500);
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
        <h1 className="text-2xl font-bold">My Concrete Tests</h1>
        <Button onClick={() => router.push("/staff/concrete-tests/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Test
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
          onRowClick={(row) => router.push(`/staff/concrete-tests/${row.id}`)}
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

export default function StaffConcreteTestsPage() {
  return (
    <Suspense>
      <ConcreteTestsInner />
    </Suspense>
  );
}
