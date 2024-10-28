"use client";

import { DeclaracionModule } from "@/modules/company/declaraciones/DeclaracionById";
import { fetchData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { useEffect, useState } from "react";

export default function DeclaracionPage({
  params: { idDeclaracion },
}: {
  params: { idDeclaracion: number };
}) {
  const [statements, setStatements] = useState<IInfoDeclaracion | null>(null);
  const [basicSalary, setBasicSalary] = useState(null);
  const [rate, setRate] = useState([]);

  const { user } = userStore();
  const idCompany = user?.empresa?.id;

  useEffect(() => {
    const fetchStatement = async () => {
      if (!idCompany) return;

      const result = await fetchData(
        `statements/info/${idCompany}/${idDeclaracion}`
      );

      if (result && result.data) {
        setStatements(result.data);
      }
    };

    const getBasicSalary = async () => {
      const basicSalary = await fetchData("basicSalary");

      if (basicSalary.ok) {
        setBasicSalary(basicSalary.data[0].sueldo_basico);
      }
    };

    const getRate = async () => {
      const rate = await fetchData("rates");

      if (rate.ok) {
        setRate(rate.data[0]);
      }
    };

    fetchStatement();
    getBasicSalary();
    getRate();
  }, [idCompany, idDeclaracion]);

  if (!statements) {
    return <div>Cargando...</div>;
  }

  return (
    <DeclaracionModule
      statement={statements}
      basicSalary={basicSalary}
      rate={rate}
    />
  );
}
