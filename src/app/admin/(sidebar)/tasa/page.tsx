"use client";
import TasasModule from "@/modules/Admin/Tasas";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function Escalas() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchData("rates");

      setData(result.data);
    };

    fetch();
  }, []);

  if (!data.length) return <div>Cargando</div>;

  return <TasasModule data={data} />;
}
