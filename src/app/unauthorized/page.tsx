// app/unauthorized/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-red-500">No Autorizado</h1>
        <p className="mb-6">No tienes permiso para acceder a esta página.</p>
        <Button 
          onClick={() => router.push('/')}
        >
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
}