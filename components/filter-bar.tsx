"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/date-range-picker";
import { X } from "lucide-react";
import type { FilterState } from "@/lib/types";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClear: () => void;
  hasFilters: boolean | string;
}

export function FilterBar({ filters, onFilterChange, onClear, hasFilters }: FilterBarProps) {
  const [projects, setProjects] = useState<string[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("project_name")
        .select("projectname")
        .order("projectname");
      setProjects((data ?? []).map((r: any) => r.projectname));
    }
    load();
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.project || undefined}
        onValueChange={(v) => onFilterChange("project", v)}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="All projects" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DateRangePicker
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onDateFromChange={(v) => onFilterChange("dateFrom", v)}
        onDateToChange={(v) => onFilterChange("dateTo", v)}
      />

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1 h-4 w-4" /> Clear
        </Button>
      )}
    </div>
  );
}
