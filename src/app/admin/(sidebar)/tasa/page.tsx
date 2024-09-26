import TasasModule from "@/modules/Admin/Tasas";
import { fetchData } from "@/services/mysql/functions";

export default async function Escalas() {
  const result = await fetchData("rates");

  if (!result.ok || result.error) {
    return <div>Error</div>;
  }

  const data = result.data;

  return <TasasModule data={data} />;
}
