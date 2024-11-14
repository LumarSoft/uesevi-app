"use client";
import DeclaracionesModule from "@/modules/Admin/DeclaracionJurada";
import { fetchData } from "@/services/mysql/functions";
import { Loader } from "@/shared/components/Loader/Loader";
import { useEffect, useState } from "react";

export default function Declaraciones() {
  const [dataCompanies, setDataCompanies] = useState([]);
  const [dataStatements, setDataStatements] = useState([]);
  const [dataContracts, setDataContracts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const companiesResult = await fetchData("companies");

      const statementsResult = await fetchData("statements");

      setDataCompanies(companiesResult.data);
      setDataStatements(statementsResult.data);
    };

    fetch();
  }, []);

  if (!dataCompanies.length || !dataStatements.length) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <DeclaracionesModule
      companies={dataCompanies}
      statements={dataStatements}
    />
  );
}
