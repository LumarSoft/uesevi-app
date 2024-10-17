"use client";
import AdminNoticiasModule from "@/modules/Admin/Noticias";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function AdminNoticias() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchData("news");
      if (!result.ok) {
        console.error("Error al obtener las noticias:", result.error);
        return;
      }
      setData(result.data);
    };
  }, []);

  return <AdminNoticiasModule news={data} />;
}
