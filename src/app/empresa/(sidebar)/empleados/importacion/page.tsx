"use client";
import ImportacionEmpleadosModule from "@/modules/company/empleados/importacion";
import { fetchOneRow } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { useEffect, useState } from "react";

export default function ImportacionEmpleadosPage() {
  const [lastDeclaration, setlastDeclaration] = useState<IDeclaracion | null>(
    null
  );
  const { user } = userStore();
  const idCompany = user?.empresa?.id;

  useEffect(() => {
    const fetchLastDeclaration = async () => {
      const result = await fetchOneRow(
        "statements/lastDeclaration/:id",
        idCompany
      );
      setlastDeclaration(result.data);
    };

    if (idCompany) {
      fetchLastDeclaration();
    }
  }, [idCompany]);

  return <ImportacionEmpleadosModule lastDeclaration={lastDeclaration} />;
}
