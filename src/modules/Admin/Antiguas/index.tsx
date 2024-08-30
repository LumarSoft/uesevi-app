"use client";

import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import SearchCard from "./components/Search/SearchCard";
import { IOldEmpresa } from "@/shared/types/Querys/IOldEmpresa";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/columns";
import { IOldDeclaracion } from "@/shared/types/Querys/IOldDeclaracion";
import { IOldContratos } from "@/shared/types/Querys/IOldContratos";
import { useState } from "react";

export default function DeclaracionesModule({
  empresas,
  declaraciones,
  contratos,
}: {
  empresas: IOldEmpresa[];
  declaraciones: IOldDeclaracion[];
  contratos: IOldContratos[];
}) {
  const [declaracionesState, setDeclaracionesState] = useState(declaraciones);

  const changeState = (updatedItem: IOldDeclaracion) => {
    const newData = declaracionesState.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setDeclaracionesState(newData);
  };

  const columns = createColumns(changeState);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaraciones Juradas Antiguas
          </h2>
        </div>
        <p><i>Con fecha previa al 28/10/2021</i></p>
        <SearchCard
          empresas={empresas}
          contratos={contratos}
          declaraciones={declaraciones}
          setDeclaracionesState={setDeclaracionesState}
        />
        <DataTable columns={columns} data={declaracionesState || []} />
      </div>
    </div>
  );
}
