import EscalasModule from "@/modules/Admin/Escalas";
import { fetchData } from "@/services/mysql/functions";

export default async function Escalas() {
  const result = await fetchData("scales");

  if (!result.ok || result.error) {
    return <div>Error al solicitar los datos</div>;
  }
  
  const data = result.data;

  return <EscalasModule data={data} />;
}
