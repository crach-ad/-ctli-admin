"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusTextColors } from "@/lib/calendar-utils";
import type { CalendarEvent } from "@/lib/types";

interface CalendarListProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export function CalendarList({ events, onEventClick }: CalendarListProps) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No tests scheduled.</p>;
  }

  return (
    <div className="space-y-2">
      {events.map((event) => (
        <div
          key={`${event.id}-${event.testdate}`}
          className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-gray-50"
          onClick={() => onEventClick?.(event)}
        >
          <div>
            <p className="text-sm font-medium">{event.projectname ?? "Unknown Project"}</p>
            <p className="text-xs text-muted-foreground">
              Test date: {event.testdate ? format(new Date(event.testdate), "MMM d, yyyy") : "—"}
              {" | "}Age: {event.ageofcylinder} days
              {event.compressivestrength_psi && ` | Strength: ${event.compressivestrength_psi} PSI`}
            </p>
          </div>
          <Badge className={cn("capitalize", statusTextColors[event.status])} variant="outline">
            {event.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}
