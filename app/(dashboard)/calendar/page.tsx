"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarGrid } from "@/components/calendar-grid";
import { CalendarList } from "@/components/calendar-list";
import { buildCalendarEvents } from "@/lib/calendar-utils";
import { addMonths, subMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight, List, Grid3X3 } from "lucide-react";
import type { ConcreteTestSubform, CalendarEvent } from "@/lib/types";

export default function CalendarPage() {
  const [tests, setTests] = useState<ConcreteTestSubform[]>([]);
  const [projects, setProjects] = useState<string[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const [testsRes, projectsRes] = await Promise.all([
        supabase
          .from("tblconcretetestsubform")
          .select("*")
          .not("castdate", "is", null)
          .not("ageofcylinder", "is", null),
        supabase.from("project_name").select("projectname").order("projectname"),
      ]);
      setTests((testsRes.data ?? []) as ConcreteTestSubform[]);
      setProjects((projectsRes.data ?? []).map((r) => r.projectname));
      setLoading(false);
    }
    load();
  }, []);

  const events = useMemo(() => {
    let filtered = tests;
    if (projectFilter) {
      filtered = filtered.filter((t) => t.projectname === projectFilter);
    }
    return buildCalendarEvents(filtered);
  }, [tests, projectFilter]);

  const listEvents = useMemo(() => {
    return [...events]
      .filter((e) => e.status !== "completed")
      .sort((a, b) => (a.testdate ?? "").localeCompare(b.testdate ?? ""));
  }, [events]);

  function handleEventClick(event: CalendarEvent) {
    router.push(`/concrete-tests/${event.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Test Schedule</h1>
        <div className="flex items-center gap-2">
          <Select
            value={projectFilter || undefined}
            onValueChange={(v) => setProjectFilter(v)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {projectFilter && (
            <Button variant="ghost" size="sm" onClick={() => setProjectFilter("")}>
              Clear
            </Button>
          )}
          <div className="flex border rounded-md">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : view === "grid" ? (
        <>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</h2>
            <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <CalendarGrid currentMonth={currentMonth} events={events} />
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Upcoming</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Overdue</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Completed</span>
          </div>
        </>
      ) : (
        <CalendarList events={listEvents} onEventClick={handleEventClick} />
      )}
    </div>
  );
}
