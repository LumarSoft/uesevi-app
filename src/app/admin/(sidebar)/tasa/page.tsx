"use client";
import TasasModule from "@/modules/Admin/Tasas";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function Escalas() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchData("rates");
      if (!result.ok) {
        console.error("Error al obtener las tasas:", result.error);
        return;
      }
      setData(result.data);
    };

    fetch();
  }, []);

  return <TasasModule data={data} />;
}
