"use client";
import { HistorialDeclaracionesModule } from "@/modules/Admin/DeclaracionJurada/historial";
import { fetchData } from "@/services/mysql/functions";
import { Loader } from "@/shared/components/Loader/Loader";
import { useEffect, useState } from "react";

export default function HistorialDeclaraciones({
  params: { idEmpresa, anio, mes },
}: {
  params: { idEmpresa: number; anio: number; mes: number };
}) {
  const [statements, setStatements] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const statementsResult = await fetchData(
          `statements/history/${idEmpresa}/${anio}/${mes}`
        );

        if (statementsResult.ok) {
          setStatements(statementsResult.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.log("Error al cargar los datos:", error);
      }
    };

    fetchStatements();
  }, [idEmpresa, anio, mes]);

  if (loading) {
    return <Loader />;
  }
  if (!statements.length) {
    return <div>Error al cargar los datos</div>;
  }

  return <HistorialDeclaracionesModule statements={statements} />;
}
