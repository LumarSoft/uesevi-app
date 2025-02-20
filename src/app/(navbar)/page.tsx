"use client";
import HomeModule from "@/modules/Client/Home";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function Home() {
  const [lastNews, setlastNews] = useState<any[]>([]);

  useEffect(() => {
    async function loadLastNews() {
      try {
        const newsResponse = await fetchData("news/last-three");
        setlastNews(newsResponse.data);
      } catch (error) {
        console.error("Error al obtener las noticias:", error);
      }
    }

    loadLastNews();
  }, []);

  return <HomeModule noticias={lastNews} />;
}
