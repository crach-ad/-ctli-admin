import { addDays, isBefore, isAfter, startOfDay, format } from "date-fns";
import type { ConcreteTestSubform, CalendarEvent } from "@/lib/types";

export function buildCalendarEvents(tests: ConcreteTestSubform[]): CalendarEvent[] {
  const today = startOfDay(new Date());

  return tests
    .filter((t) => t.castdate && t.ageofcylinder)
    .map((t) => {
      const castDate = new Date(t.castdate!);
      const expectedTestDate = addDays(castDate, t.ageofcylinder!);
      const hasResult = !!t.compressivestrength_psi;

      let status: CalendarEvent["status"];
      if (hasResult) {
        status = "completed";
      } else if (isBefore(expectedTestDate, today)) {
        status = "overdue";
      } else {
        status = "upcoming";
      }

      return {
        id: t.id,
        projectname: t.projectname,
        castdate: t.castdate,
        testdate: format(expectedTestDate, "yyyy-MM-dd"),
        ageofcylinder: t.ageofcylinder,
        compressivestrength_psi: t.compressivestrength_psi,
        status,
      };
    });
}

export function getEventsForDate(events: CalendarEvent[], dateStr: string): CalendarEvent[] {
  return events.filter((e) => e.testdate === dateStr);
}

export function getUpcomingEvents(events: CalendarEvent[], days: number = 7): CalendarEvent[] {
  const today = startOfDay(new Date());
  const end = addDays(today, days);

  return events
    .filter(
      (e) =>
        e.status !== "completed" &&
        !isAfter(new Date(e.testdate!), end)
    )
    .sort((a, b) => (a.testdate ?? "").localeCompare(b.testdate ?? ""));
}

export const statusColors = {
  upcoming: "bg-blue-500",
  overdue: "bg-red-500",
  completed: "bg-green-500",
} as const;

export const statusTextColors = {
  upcoming: "text-blue-700 bg-blue-50",
  overdue: "text-red-700 bg-red-50",
  completed: "text-green-700 bg-green-50",
} as const;
