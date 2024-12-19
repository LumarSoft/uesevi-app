"use client";

import ImportacionEmpleadosModule from "@/modules/company/empleados/importacion";
import { fetchOneRow } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { useEffect, useState } from "react";

export default function ImportacionEmpleadosPage() {
  const [lastDeclaration, setLastDeclaration] = useState<IDeclaracion | null>(
    null
  );
  const { user } = userStore();
  const idCompany = user?.empresa.id!; // Asumimos que siempre estará presente.

  useEffect(() => {
    const fetchLastDeclaration = async () => {
      try {
        const result = await fetchOneRow(
          "statements/lastDeclaration/:id",
          idCompany
        );
        setLastDeclaration(result.data);
      } catch (error) {
        console.error("Error fetching last declaration:", error);
      }
    };

    fetchLastDeclaration();
  }, [idCompany]);

  return <ImportacionEmpleadosModule lastDeclaration={lastDeclaration} />;
}
