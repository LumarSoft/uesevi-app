import HomeModule from "@/modules/Client/Home";
import { fetchData } from "@/services/mysql/functions";

export default async function Home() {
  const latestNewsResponse = await fetchData("news/last-three");

  const latestNews = latestNewsResponse.data;

  return <HomeModule noticias={latestNews} />;
}
