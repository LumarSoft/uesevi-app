"use client";
import ImportacionEmpleadosModule, {
  IStatementResponse,
} from "@/modules/company/empleados/importacion";
import { fetchOneRow } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { useEffect, useState } from "react";

export default function ImportacionEmpleadosPage() {
  const [statementsData, setStatementsData] = useState<IStatementResponse | null>(null);
  const { user } = userStore();
  const idCompany = user?.empresa?.id;

  useEffect(() => {
    const fetchLastDeclaration = async () => {
      const result = await fetchOneRow(
        "statements/getMissingStatements/:id",
        idCompany
      );
      setStatementsData(result.data);
    };

    if (idCompany) {
      fetchLastDeclarations();
    }
  }, [idCompany]);

  return (
    <ImportacionEmpleadosModule statementsData={statementsData} />
  );
}