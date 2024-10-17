"use client";
import AdminNoticiasModule from "@/modules/Admin/Noticias";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function AdminNoticias() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchData("news");

      setData(result.data);
    };

    fetch();
  }, []);

  if (!data.length) {
    return <div>Cargando</div>;
  }

  return <AdminNoticiasModule news={data} />;
}
