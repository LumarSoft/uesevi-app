"use client";
import DeclaracionesModule from "@/modules/Admin/DeclaracionJurada";
import { fetchData } from "@/services/mysql/functions";
import { useEffect, useState } from "react";

export default function Declaraciones() {
  const [dataCompanies, setDataCompanies] = useState([]);
  const [dataStatements, setDataStatements] = useState([]);
  const [dataContracts, setDataContracts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const companiesResult = await fetchData("companies");

      const statementsResult = await fetchData("statements");

      const contractsResult = await fetchData("contracts");

      if (!companiesResult.ok || !statementsResult.ok || !contractsResult.ok) {
        return <div>Error al cargar los datos</div>;
      }

      setDataCompanies(companiesResult.data);
      setDataStatements(statementsResult.data);
      setDataContracts(contractsResult.data);
    };

    fetch();
  }, []);

  return (
    <DeclaracionesModule
      companies={dataCompanies}
      statements={dataStatements}
      contracts={dataContracts}
    />
  );
}
