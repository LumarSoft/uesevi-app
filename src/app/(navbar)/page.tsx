"use client";
import HomeModule from "@/modules/Client/Home";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const response = await fetchData("news/last-three");
      setData(response.data);
    };
    fetch();
  }, []);

  return <HomeModule noticias={data} />;
}
