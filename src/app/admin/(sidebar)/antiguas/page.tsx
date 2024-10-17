"use client";
import DeclaracionesViejasModule from "@/modules/Admin/Antiguas";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function AntiguasPage() {
  const [companies, setCompanies] = useState([]);
  const [statements, setStatements] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const companiesResult = await fetchData("old-companies");
      const statementsResult = await fetchData("old-statements");
      const contractsResult = await fetchData("old-contracts");

      setCompanies(companiesResult.data);
      setStatements(statementsResult.data);
      setContracts(contractsResult.data);
    };

    fetch();
  }, []);

  if (!companies.length || !statements.length || !contracts.length) {
    return <div>Cargando</div>;
  }

  return (
    <DeclaracionesViejasModule
      companies={companies}
      statements={statements}
      contracts={contracts}
    />
  );
}
