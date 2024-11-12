"use client";

import { Button } from "@/components/ui/button";

export default function InstructivoModule() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/instructivo.pdf";
    link.download = "instructivo.pdf";
    link.click();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Instructivo</h2>
        </div>
        <Button onClick={handleDownload}>Descargar instructivo</Button>
      </div>
    </div>
  );
}
