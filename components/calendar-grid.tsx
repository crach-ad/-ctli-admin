"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import { getEventsForDate, statusColors } from "@/lib/calendar-utils";
import type { CalendarEvent } from "@/lib/types";

interface CalendarGridProps {
  currentMonth: Date;
  events: CalendarEvent[];
  onDateClick?: (date: string) => void;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ currentMonth, events, onDateClick }: CalendarGridProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-md">
        {weekDays.map((day) => (
          <div key={day} className="bg-gray-50 p-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-b-md">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayEvents = getEventsForDate(events, dateStr);
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);

          return (
            <div
              key={dateStr}
              className={cn(
                "min-h-[80px] bg-white p-1.5 cursor-pointer hover:bg-gray-50 transition-colors",
                !inMonth && "bg-gray-50 text-muted-foreground"
              )}
              onClick={() => onDateClick?.(dateStr)}
            >
              <div
                className={cn(
                  "text-xs font-medium mb-1",
                  today && "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                )}
              >
                {format(day, "d")}
              </div>
              <div className="flex flex-wrap gap-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={cn("w-2 h-2 rounded-full", statusColors[event.status])}
                    title={`${event.projectname} - ${event.status}`}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{dayEvents.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
