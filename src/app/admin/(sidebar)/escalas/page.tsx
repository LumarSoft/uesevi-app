"use client";
import EscalasModule from "@/modules/Admin/Escalas";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function Escalas() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchData("scales");
      if (!result.ok || result.error) {
        return;
      }
      setData(result.data);
    };
    fetch();
  }, []);

  return <EscalasModule data={data} />;
}
