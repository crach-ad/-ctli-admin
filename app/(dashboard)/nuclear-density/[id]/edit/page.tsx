"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NuclearDensityForm } from "@/components/forms/nuclear-density-form";
import type { NuclearDensity } from "@/lib/types";

export default function EditNuclearDensityPage() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<NuclearDensity | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tblnucleardensity")
        .select("*")
        .eq("id", id)
        .single();
      setRecord(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!record) return <p>Record not found.</p>;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <NuclearDensityForm initialData={record} />
    </div>
  );
}
