import EscalasModule from "@/modules/Client/escalas";
import { fetchData } from "@/services/mysql/functions";
import { Suspense } from "react";
import Loading from "./Loading";

export default async function EscalasPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AsyncScalesContent />
    </Suspense>
  );
  async function AsyncScalesContent() {
    async function loadScales() {
      const scalesResponse = await fetchData("scales/clients");

      if (!scalesResponse.ok || scalesResponse.error) {
        console.error("Error al obtener las escalas:", scalesResponse.error);
        return { scales: [] };
      }

      // Simulación de retraso
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return scalesResponse.data;
    }

    const scales = await loadScales();

    return <EscalasModule scales={scales} />;
  }
}
