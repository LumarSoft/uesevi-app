"use client";
import ConsultasModule from "@/modules/Admin/Consultas";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function ConsultasPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const inquiriesResult = await fetchData("inquiries");
      setData(inquiriesResult.data);
    };
    fetch();
  }, []);

  if (data.length === 0) {
    return <div>Error al cargar los datos</div>;
  }

  return <ConsultasModule inquiries={data} />;
}
