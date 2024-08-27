import NoticiasPageModule from "@/modules/Client/noticias";
import { fetchData } from "@/services/mysql/functions";

export default async function NoticiasPage() {
  const noticias = await fetchData("noticias");
  return <NoticiasPageModule noticias={noticias} />;
}
