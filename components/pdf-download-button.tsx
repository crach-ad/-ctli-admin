"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PdfDownloadButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateDocument: () => Promise<React.ReactElement<any, any>>;
  fileName: string;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function PdfDownloadButton({
  generateDocument,
  fileName,
  label = "Download PDF",
  variant = "outline",
  size = "default",
}: PdfDownloadButtonProps) {
  const [generating, setGenerating] = useState(false);

  async function handleClick() {
    setGenerating(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const doc = await generateDocument();
      const blob = await pdf(doc as any).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleClick} disabled={generating}>
      <Download className="mr-2 h-4 w-4" />
      {generating ? "Generating..." : label}
    </Button>
  );
}
