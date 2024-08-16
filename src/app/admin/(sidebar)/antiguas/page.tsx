import AntiguasModule from "@/modules/Admin/Antiguas";
import { fetchData } from "@/services/mysql/functions";

export default async function Antiguas() {
  const result = await fetchData("antiguas");

  console.log(result);
  if (result) {
    return <AntiguasModule/>;
  } else {
    return <div>Error: al solicitar los datos</div>;
  }
}
