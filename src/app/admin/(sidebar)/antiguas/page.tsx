import AntiguasModule from "@/modules/Admin/Antiguas";
import { fetchData } from "@/services/mysql/functions";

export default async function Antiguas() {
  const result = await fetchData("antiguas");

  if (result) {
    return <AntiguasModule data={result} />;
  } else {
    return <div>Error: al solicitar los datos</div>;
  }
}
