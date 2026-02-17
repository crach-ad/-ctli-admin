"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DataTable, Column } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { RoleGate } from "@/components/role-gate";
import { Badge } from "@/components/ui/badge";
import { FilterBar } from "@/components/filter-bar";
import { useFilters } from "@/lib/hooks/use-filters";
import { Plus } from "lucide-react";
import type { NuclearDensity } from "@/lib/types";

const columns: Column<NuclearDensity>[] = [
  { key: "id", label: "ID" },
  { key: "projectname", label: "Project" },
  {
    key: "fieldinspectiondate",
    label: "Date",
    render: (row) =>
      row.fieldinspectiondate
        ? new Date(row.fieldinspectiondate).toLocaleDateString()
        : "",
  },
  { key: "structurepourlocation2", label: "Location" },
  { key: "datasheet_recorder", label: "Recorder" },
  {
    key: "comppass",
    label: "Compaction",
    render: (row) =>
      row.comppass ? (
        <Badge variant="default">Pass</Badge>
      ) : row.compfail ? (
        <Badge variant="destructive">Fail</Badge>
      ) : (
        "—"
      ),
  },
  {
    key: "moisturepass",
    label: "Moisture",
    render: (row) =>
      row.moisturepass ? (
        <Badge variant="default">Pass</Badge>
      ) : row.moisturefail ? (
        <Badge variant="destructive">Fail</Badge>
      ) : (
        "—"
      ),
  },
];

function NuclearDensityPageInner() {
  const [data, setData] = useState<NuclearDensity[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const { filters, setFilter, clearFilters, hasFilters } = useFilters();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tblnucleardensity")
        .select("*")
        .order("id", { ascending: false });
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
        <h1 className="text-2xl font-bold">Nuclear Density Tests</h1>
        <RoleGate allowedRoles={["admin", "field_inspector"]}>
          <Button onClick={() => router.push("/nuclear-density/new")}>
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
          onRowClick={(row) => router.push(`/nuclear-density/${row.id}`)}
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

export default function NuclearDensityPage() {
  return (
    <Suspense>
      <NuclearDensityPageInner />
    </Suspense>
  );
}
