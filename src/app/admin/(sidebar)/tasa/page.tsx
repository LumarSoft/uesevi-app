import TasasModule from "@/modules/Admin/Tasas";
import { fetchData } from "@/services/mysql/functions";

export default async function Escalas() {
  const result = await fetchData("rates");

  if (result) {
    return <TasasModule data={result} />;
  } else {
    return <div>Error: al solicitar los datos</div>;
  }
}
