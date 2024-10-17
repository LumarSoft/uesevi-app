"use client";
import { DeclaracionModule } from "@/modules/Admin/Antiguas/DeclaracionById";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function Declaracion({
  params: { idEmpresa, idDeclaracion },
}: {
  params: { idEmpresa: number; idDeclaracion: number };
}) {
  const [statement, setStatement] = useState(null);

  useEffect(() => {
    const fetchStatement = async () => {
      const statementResult = await fetchData(
        `old-statements/info/${idEmpresa}/${idDeclaracion}`
      );

      if (statementResult.ok) {
        setStatement(statementResult.data);
      }
    };

    fetchStatement();
  }, [idEmpresa, idDeclaracion]);

  if (!statement) {
    return <div>Error al cargar los datos</div>;
  }

  return <DeclaracionModule statement={statement} />;
}
