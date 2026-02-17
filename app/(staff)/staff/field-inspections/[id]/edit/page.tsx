"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ConcreteFieldForm } from "@/components/forms/concrete-field-form";
import type { ConcreteField } from "@/lib/types";

export default function StaffEditFieldInspectionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [record, setRecord] = useState<ConcreteField | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (authLoading || !user) return;
    async function load() {
      const { data } = await supabase
        .from("tblconcretefield")
        .select("*")
        .eq("id", id)
        .eq("created_by", user!.id)
        .single();
      setRecord(data);
      setLoading(false);
    }
    load();
  }, [id, user, authLoading]);

  if (loading || authLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (!record) return <p>Record not found or access denied.</p>;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <ConcreteFieldForm initialData={record} basePath="/staff/field-inspections" />
    </div>
  );
}
