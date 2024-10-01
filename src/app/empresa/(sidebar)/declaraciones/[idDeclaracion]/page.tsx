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

    fetchStatement();
  }, [idCompany, idDeclaracion]);

  if (!statements) {
    return <div>Cargando...</div>;
  }

  return <DeclaracionModule statement={statements} />;
}
