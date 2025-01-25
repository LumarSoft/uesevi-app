"use client";

import DeudorasSection from "@/modules/Admin/Deudoras";

export default function DeudorasPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Empresas Deudoras</h1>
      <DeudorasSection />
    </div>
  );
}
