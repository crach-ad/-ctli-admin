"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DataTable, Column } from "@/components/data-table";
import type { ProjectName } from "@/lib/types";

const columns: Column<ProjectName>[] = [
  { key: "projectname", label: "Project Name" },
];

export default function ProjectsPage() {
  const [data, setData] = useState<ProjectName[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("project_name")
        .select("*")
        .order("projectname");
      setData(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Projects</h1>
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <DataTable
          data={data}
          columns={columns}
          searchKey="projectname"
          searchPlaceholder="Search projects..."
          onRowClick={(row) =>
            router.push(`/projects/${encodeURIComponent(row.projectname)}`)
          }
        />
      )}
    </div>
  );
}
