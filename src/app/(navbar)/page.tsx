import HomeModule from "@/modules/Client/Home";
import { fetchData } from "@/services/mysql/functions";

export default async function Home() {
  const latestNews = await fetchData("news/getLastThree");

  return <HomeModule noticias={latestNews}/>;
}
