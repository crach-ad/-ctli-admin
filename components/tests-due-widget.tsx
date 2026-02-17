"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { buildCalendarEvents, getUpcomingEvents, statusTextColors } from "@/lib/calendar-utils";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import type { ConcreteTestSubform, CalendarEvent } from "@/lib/types";

export function TestsDueWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tblconcretetestsubform")
        .select("*")
        .not("castdate", "is", null)
        .not("ageofcylinder", "is", null);
      const allEvents = buildCalendarEvents((data ?? []) as ConcreteTestSubform[]);
      setEvents(getUpcomingEvents(allEvents, 7));
      setLoading(false);
    }
    load();
  }, []);

  const overdueCount = events.filter((e) => e.status === "overdue").length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          Tests Due This Week
          {overdueCount > 0 && (
            <Badge variant="destructive" className="ml-2">{overdueCount} overdue</Badge>
          )}
        </CardTitle>
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tests due this week.</p>
        ) : (
          <div className="space-y-2">
            {events.slice(0, 5).map((event) => (
              <div
                key={`${event.id}-${event.testdate}`}
                className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 rounded p-1"
                onClick={() => router.push(`/concrete-tests/${event.id}`)}
              >
                <div>
                  <span className="font-medium">{event.projectname}</span>
                  <span className="text-muted-foreground ml-2">
                    {event.testdate ? format(new Date(event.testdate), "MMM d") : ""}
                  </span>
                </div>
                <Badge className={cn("capitalize text-xs", statusTextColors[event.status])} variant="outline">
                  {event.status}
                </Badge>
              </div>
            ))}
            {events.length > 5 && (
              <p
                className="text-xs text-blue-600 cursor-pointer hover:underline"
                onClick={() => router.push("/calendar")}
              >
                +{events.length - 5} more — View calendar
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
