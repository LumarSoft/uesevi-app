import TasasModule from "@/modules/Admin/Tasas";
import { fetchData } from "@/services/mysql/functions";

export default async function Escalas() {
  const result = await fetchData("tasas");

  if (result) {
    return <TasasModule data={result} />;
  } else {
    return <div>Error: al solicitar los datos</div>;
  }
}
