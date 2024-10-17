"use client";

import { useEffect, useState } from "react";
import EscalasModule from "@/modules/Client/escalas";
import { fetchData } from "@/services/mysql/functions";
import Loading from "./Loading";

export default function EscalasPage() {
  const [scales, setScales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScales() {
      try {
        const scalesResponse = await fetchData("scales/clients");

        // Simulación de retraso
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setScales(scalesResponse.data);
      } catch (err: unknown) {
        console.error("Error al obtener las escalas:", err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    }

    loadScales();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <EscalasModule scales={scales} />;
}
