"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface LookupConfig {
  table: string;
  column: string;
}

export function useLookups(configs: LookupConfig[]) {
  const [lookups, setLookups] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const results = await Promise.all(
        configs.map(({ table, column }) =>
          supabase.from(table).select(column).order(column)
        )
      );
      const map: Record<string, string[]> = {};
      configs.forEach(({ table, column }, i) => {
        map[table] = (results[i].data ?? []).map((r: any) => r[column]);
      });
      setLookups(map);
      setLoading(false);
    }
    load();
  }, []);

  return { lookups, loading };
}
