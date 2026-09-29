"use client";

import HistorialDeclaracionesEmpresasModule from "@/modules/company/declaraciones/Historial";
import { fetchData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { useEffect, useState } from "react";
import { Loader } from "@/shared/components/Loader/Loader";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";

export default function HistorialDeclaracionesEmpresa({
  params: { anio, mes },
}: {
  params: { anio: number; mes: number };
}) {
  const [statements, setStatements] = useState<IDeclaracion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { user } = userStore();

  const companyId = user?.empresa?.id;

  useEffect(() => {
    // Solo ejecuta la función fetchs si companyId ya tiene un valor
    if (companyId) {
      const fetchs = async () => {
        try {
          const statementsResult = await fetchData(
            `statements/history/${companyId}/${anio}/${mes}`
          );
          if (statementsResult.ok) {
            setStatements(statementsResult.data);
            setError(false);
          } else {
            setError(true);
          }
        } catch {
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchs();
    }
  }, [companyId, anio, mes]); // Añadimos companyId, anio y mes como dependencias

  if (loading) return <Loader />;
  if (error) return <div>No se pudo cargar el historial de declaraciones.</div>;
  if (!statements.length) return <div>No hay versiones para este período.</div>;

  return <HistorialDeclaracionesEmpresasModule statements={statements} />;
}
