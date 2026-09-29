"use client";
import { HistorialDeclaracionesModule } from "@/modules/Admin/DeclaracionJurada/historial";
import { fetchData } from "@/services/mysql/functions";
import { Loader } from "@/shared/components/Loader/Loader";
import { useEffect, useState } from "react";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";

export default function HistorialDeclaraciones({
  params: { idEmpresa, anio, mes },
}: {
  params: { idEmpresa: number; anio: number; mes: number };
}) {
  const [statements, setStatements] = useState<IDeclaracion[]>([]);
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
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStatements();
  }, [idEmpresa, anio, mes]);

  if (loading) {
    return <Loader />;
  }
  if (error) return <div>No se pudo cargar el historial de declaraciones.</div>;
  if (!statements.length) return <div>No hay versiones para este período.</div>;

  return <HistorialDeclaracionesModule statements={statements} />;
}
