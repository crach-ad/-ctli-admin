"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ConcreteTestForm } from "@/components/forms/concrete-test-form";

export default function StaffNewConcreteTestPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <ConcreteTestForm basePath="/staff/concrete-tests" />
    </div>
  );
}
