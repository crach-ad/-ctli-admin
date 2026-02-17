"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ConcreteTestForm } from "@/components/forms/concrete-test-form";
import type { ConcreteTestSubform } from "@/lib/types";

export default function EditConcreteTestPage() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<ConcreteTestSubform | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tblconcretetestsubform")
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
      <ConcreteTestForm initialData={record} />
    </div>
  );
}
