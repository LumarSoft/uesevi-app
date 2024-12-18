"use client";

import SearchCard from "./components/Search/SearchCard";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/columns";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { IContratos } from "@/shared/types/Querys/IContratos";
import { useEffect, useState } from "react";

export default function DeclaracionesModule({
  companies,
  statements,
}: {
  companies: IEmpresa[];
  statements: IDeclaracion[];
}) {
  const [statementsState, setStatementsState] =
    useState<IDeclaracion[]>(statements);

  useEffect(() => {
    // Recuperar estado desde sessionStorage si existe
    const savedState = sessionStorage.getItem("searchState");
    if (savedState) {
      const { filteredStatements } = JSON.parse(savedState);
      setStatementsState(filteredStatements);
    }
  }, []);

  const changeState = (updatedItem: IDeclaracion) => {
    const newData = statementsState.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setStatementsState(newData);
  };

  const deleteStatement = (id: number) => {
    const newData = statementsState.filter((item) => item.id !== id);
    setStatementsState(newData);
  };

  const columns = createColumns(changeState, deleteStatement);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaraciones Juradas
          </h2>
        </div>
        <SearchCard
          companies={companies}
          statements={statements}
          setStatementsState={setStatementsState}
        />
        <DataTable columns={columns} data={statementsState || []} />
      </div>
    </div>
  );
}
