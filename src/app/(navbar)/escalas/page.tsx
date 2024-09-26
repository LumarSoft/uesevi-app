import EscalasModule from "@/modules/Client/escalas";
import { fetchData } from "@/services/mysql/functions";

export default async function EscalasPage() {
  const scalesResponse = await fetchData("scales/clients");

  console.log("scalesResponse", scalesResponse);

  if (!scalesResponse.ok || scalesResponse.error) {
    console.error("Error al obtener las escalas:", scalesResponse.error);
    return <div>Error al cargar las escalas.</div>;
  }

  const scales = scalesResponse.data;

  return <EscalasModule scales={scales} />;
}


