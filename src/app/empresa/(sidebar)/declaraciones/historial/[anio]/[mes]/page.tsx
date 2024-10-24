"use client";

import HistorialDeclaracionesEmpresasModule from "@/modules/company/declaraciones/Historial";
import { fetchData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { useEffect, useState } from "react";

export default function HistorialDeclaracionesEmpresa({
  params: { anio, mes },
}: {
  params: { anio: number; mes: number };
}) {
  const [statements, setStatements] = useState([]);

  const { user } = userStore();

  const companyId = user?.empresa?.id;

  useEffect(() => {
    // Solo ejecuta la función fetchs si companyId ya tiene un valor
    if (companyId) {
      const fetchs = async () => {
        const statementsResult = await fetchData(
          `statements/history/${companyId}/${anio}/${mes}`
        );
        console.log(statementsResult);

        if (statementsResult.ok) {
          setStatements(statementsResult.data);
        }
      };

      fetchs();
    }
  }, [companyId, anio, mes]); // Añadimos companyId, anio y mes como dependencias

  if (!statements.length) {
    return <div>Error al cargar los datos</div>;
  }

  return <HistorialDeclaracionesEmpresasModule statements={statements} />;
}
