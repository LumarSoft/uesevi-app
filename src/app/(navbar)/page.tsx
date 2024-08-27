import HomeModule from "@/modules/Client/Home";
import { fetchData } from "@/services/mysql/functions";

export default async function Home() {
  const latestNews = await fetchData("ultimasNoticias");

  return <HomeModule noticias={latestNews}/>;
}
