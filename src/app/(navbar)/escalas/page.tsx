import EscalasModule from "@/modules/Client/escalas";
import { fetchData } from "@/services/mysql/functions";

export default async function EscalasPage() {
  const scales = await fetchData("scales/getAllClient")

  return <EscalasModule scales={scales}/>;
}
