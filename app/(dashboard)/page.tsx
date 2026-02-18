"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestsDueWidget } from "@/components/tests-due-widget";
import { InspectionsMap } from "@/components/inspections-map";
import { FolderOpen, HardHat, FlaskConical, Atom } from "lucide-react";

interface Stats {
  projects: number;
  fieldInspections: number;
  concreteTests: number;
  nuclearDensity: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      try {
        const [projects, field, tests, nuclear] = await Promise.all([
          supabase.from("project_name").select("*", { count: "exact", head: true }),
          supabase.from("tblconcretefield").select("*", { count: "exact", head: true }),
          supabase.from("tblconcretetestsubform").select("*", { count: "exact", head: true }),
          supabase.from("tblnucleardensity").select("*", { count: "exact", head: true }),
        ]);
        if (projects.error) console.error("projects query error:", projects.error);
        if (field.error) console.error("field query error:", field.error);
        if (tests.error) console.error("tests query error:", tests.error);
        if (nuclear.error) console.error("nuclear query error:", nuclear.error);
        setStats({
          projects: projects.count ?? 0,
          fieldInspections: field.count ?? 0,
          concreteTests: tests.count ?? 0,
          nuclearDensity: nuclear.count ?? 0,
        });
      } catch (err) {
        console.error("Dashboard stats failed:", err);
        setStats({ projects: 0, fieldInspections: 0, concreteTests: 0, nuclearDensity: 0 });
      }
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Projects", value: stats?.projects, icon: FolderOpen, href: "/projects" },
    { label: "Field Inspections", value: stats?.fieldInspections, icon: HardHat, href: "/concrete-field" },
    { label: "Concrete Tests", value: stats?.concreteTests, icon: FlaskConical, href: "/concrete-tests" },
    { label: "Nuclear Density Tests", value: stats?.nuclearDensity, icon: Atom, href: "/nuclear-density" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value !== undefined ? card.value.toLocaleString() : "..."}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <InspectionsMap />
      </div>
      <div className="mt-6">
        <TestsDueWidget />
      </div>
    </div>
  );
}
