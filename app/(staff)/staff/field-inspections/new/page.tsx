"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ConcreteFieldForm } from "@/components/forms/concrete-field-form";

export default function StaffNewFieldInspectionPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <ConcreteFieldForm basePath="/staff/field-inspections" />
    </div>
  );
}
