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
  const [basicSalary, setBasicSalary] = useState(null);

  useEffect(() => {
    const fetchStatement = async () => {
      const statementResult = await fetchData(
        `statements/info/${idEmpresa}/${idDeclaracion}`
      );

      if (statementResult.ok) {
        setStatement(statementResult.data);
      }
    };

    const getBasicSalary = async () => {
      const basicSalary = await fetchData("basicSalary");

      if (basicSalary.ok) {
        setBasicSalary(basicSalary.data[0].sueldo_basico);
      }
    };

    fetchStatement();
    getBasicSalary();
  }, [idEmpresa, idDeclaracion]);

  if (!statement) {
    return <div>Error al cargar los datos</div>;
  }

  return <DeclaracionModule statement={statement} basicSalary={basicSalary} />;
}
