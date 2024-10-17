"use client";
import { HistorialDeclaracionesModule } from "@/modules/Admin/DeclaracionJurada/historial";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function HistorialDeclaraciones({
  params: { idEmpresa, anio, mes },
}: {
  params: { idEmpresa: number; anio: number; mes: number };
}) {
  const [statements, setStatements] = useState([]);

  useEffect(() => {
    const fetchStatements = async () => {
      const statementsResult = await fetchData(
        `statements/history/${idEmpresa}/${anio}/${mes}`
      );

      if (statementsResult.ok) {
        setStatements(statementsResult.data);
      }
    };

    fetchStatements();
  }, [idEmpresa, anio, mes]);

  if (!statements.length) {
    return <div>Error al cargar los datos</div>;
  }

  return <HistorialDeclaracionesModule statements={statements} />;
}
