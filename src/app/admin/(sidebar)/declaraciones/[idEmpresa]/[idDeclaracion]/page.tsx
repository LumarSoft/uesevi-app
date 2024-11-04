"use client";
import { DeclaracionModule } from "@/modules/Admin/DeclaracionJurada/DeclaracionById";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function Declaracion({
  params: { idEmpresa, idDeclaracion },
}: {
  params: { idEmpresa: number; idDeclaracion: number };
}) {
  const [statement, setStatement] = useState(null);
  const [rate, setRate] = useState([]);

  useEffect(() => {
    const fetchStatement = async () => {
      const statementResult = await fetchData(
        `statements/info/${idEmpresa}/${idDeclaracion}`
      );

      if (statementResult.ok) {
        setStatement(statementResult.data);
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

  if (!statement) {
    return <div>Error al cargar los datos</div>;
  }

  return <DeclaracionModule statement={statement} rate={rate}/>;
}
