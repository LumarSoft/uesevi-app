"use client";
import { DeclaracionModule } from "@/modules/Admin/DeclaracionJurada/DeclaracionById";
import { fetchData } from "@/services/mysql/functions";
import { Loader } from "@/shared/components/Loader/Loader";
import { useEffect, useState } from "react";

export default function Declaracion({
  params: { idEmpresa, idDeclaracion },
}: {
  params: { idEmpresa: number; idDeclaracion: number };
}) {
  const [statement, setStatement] = useState(null);
  const [rate, setRate] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStatement = async () => {
      try {
        const statementResult = await fetchData(
          `statements/info/${idEmpresa}/${idDeclaracion}`
        );

        if (statementResult.ok) {
          setStatement(statementResult.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("Error al cargar los datos", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const getRate = async () => {
      const rate = await fetchData("rates");

      if (rate.ok) {
        setRate(rate.data[0]);
      }
    };

    fetchStatement();
    getRate();
  }, [idEmpresa, idDeclaracion]);

  if (loading) {
    return <Loader />;
  }

  if (!statement) {
    return <div>Error al cargar los datos</div>;
  }

  return <DeclaracionModule statement={statement} rate={rate} />;
}
