"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NuclearDensityForm } from "@/components/forms/nuclear-density-form";

export default function NewNuclearDensityPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <NuclearDensityForm />
    </div>
  );
}
