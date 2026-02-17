"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardHat, FlaskConical, Atom } from "lucide-react";

interface RecentItem {
  id: number;
  type: "field" | "test" | "density";
  projectname: string | null;
  date: string | null;
}

const actionCards = [
  {
    title: "New Field Inspection",
    href: "/staff/field-inspections/new",
    icon: HardHat,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    title: "New Concrete Test",
    href: "/staff/concrete-tests/new",
    icon: FlaskConical,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "New Nuclear Density",
    href: "/staff/nuclear-density/new",
    icon: Atom,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const typeBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  field: { label: "Field Inspection", variant: "default" },
  test: { label: "Concrete Test", variant: "secondary" },
  density: { label: "Nuclear Density", variant: "outline" },
};

const typeHref: Record<string, string> = {
  field: "/staff/field-inspections",
  test: "/staff/concrete-tests",
  density: "/staff/nuclear-density",
};

export default function StaffDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function load() {
      const [fields, tests, densities] = await Promise.all([
        supabase
          .from("tblconcretefield")
          .select("id, projectname, fieldinspectiondate")
          .eq("created_by", user!.id)
          .order("id", { ascending: false })
          .limit(5),
        supabase
          .from("tblconcretetestsubform")
          .select("id, projectname, castdate")
          .eq("created_by", user!.id)
          .order("id", { ascending: false })
          .limit(5),
        supabase
          .from("tblnucleardensity")
          .select("id, projectname, fieldinspectiondate")
          .eq("created_by", user!.id)
          .order("id", { ascending: false })
          .limit(5),
      ]);

      const all: RecentItem[] = [
        ...(fields.data ?? []).map((r) => ({
          id: r.id,
          type: "field" as const,
          projectname: r.projectname,
          date: r.fieldinspectiondate,
        })),
        ...(tests.data ?? []).map((r) => ({
          id: r.id,
          type: "test" as const,
          projectname: r.projectname,
          date: r.castdate,
        })),
        ...(densities.data ?? []).map((r) => ({
          id: r.id,
          type: "density" as const,
          projectname: r.projectname,
          date: r.fieldinspectiondate,
        })),
      ];

      all.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
      setRecent(all.slice(0, 5));
      setLoading(false);
    }

    load();
  }, [user, authLoading]);

  if (authLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground">Start a new form or view your recent submissions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {actionCards.map((card) => (
          <Card
            key={card.href}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => router.push(card.href)}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg p-3 ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <span className="font-medium">{card.title}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-muted-foreground">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => router.push(`${typeHref[item.type]}/${item.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={typeBadge[item.type].variant}>
                      {typeBadge[item.type].label}
                    </Badge>
                    <span className="text-sm font-medium">
                      {item.projectname ?? "No project"}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {item.date ? new Date(item.date).toLocaleDateString() : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
