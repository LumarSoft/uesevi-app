"use client";
import DeclaracionesModule from "@/modules/company/declaraciones";
import { fetchOneRow } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { useEffect, useState } from "react";

export default function DeclaracionesPage() {
  const [statements, setStatements] = useState([]);
  const { user } = userStore();

  const idCompany = user?.empresa?.id;

  useEffect(() => {
    const fetchStatements = async () => {
      const result = await fetchOneRow("statements/company/:id", idCompany);
      setStatements(result.data);
    };

    if (idCompany) {
      fetchStatements();
    }
  }, [idCompany]);

  if (statements.length > 0) {
    return <DeclaracionesModule statements={statements} />;
  }
}
