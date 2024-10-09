"use client";

import SearchCard from "./components/Search/SearchCard";
import { IOldEmpresa } from "@/shared/types/Querys/IOldEmpresa";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/Columns";
import { IOldDeclaracion } from "@/shared/types/Querys/IOldDeclaracion";
import { IOldContratos } from "@/shared/types/Querys/IOldContratos";
import { useState } from "react";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";

export default function DeclaracionesViejasModule({
  companies,
  statements,
  contracts,
}: {
  companies: IOldEmpresa[];
  statements: IOldDeclaracion[];
  contracts: IOldContratos[];
}) {
  const [statementsState, setStatementsState] = useState<
    IOldDeclaracion[] | IDeclaracion[] | undefined
  >(statements);

  const columns = createColumns();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaraciones Juradas Antiguas
          </h2>
        </div>
        <p>
          <i>Con fecha previa al 28/10/2021</i>
        </p>
        <SearchCard
          companies={companies}
          contracts={contracts}
          statements={statements}
          setStatementsState={setStatementsState}
        />
        <DataTable columns={columns} data={statementsState || []} />
      </div>
    </div>
  );
}
