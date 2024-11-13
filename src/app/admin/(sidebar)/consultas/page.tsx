"use client";
import ConsultasModule from "@/modules/Admin/Consultas";
import { fetchData } from "@/services/mysql/functions";
import { Loader } from "@/shared/components/Loader/Loader";
import { useEffect, useState } from "react";

export default function ConsultasPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetch = async () => {
      try {
        const inquiriesResult = await fetchData("inquiries");
        if (inquiriesResult.ok) {
          setData(inquiriesResult.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Error al cargar los datos:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return <Loader />;
  }
  if (data.length === 0) {
    return <div>Error al cargar los datos</div>;
  }

  return <ConsultasModule inquiries={data} />;
}
