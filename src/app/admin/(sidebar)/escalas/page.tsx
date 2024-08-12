import EscalasModule from "@/modules/Admin/Escalas";
import { fetchData } from "@/services/mysql/functions";

export default async function Escalas() {
  const result = await fetchData("escalas");

  if (result) {
    return <EscalasModule data={result} />;
  } else {
    console.error("Error fetching data");
  }
}
