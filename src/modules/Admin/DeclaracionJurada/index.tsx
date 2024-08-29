"use client";

import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import SearchCard from "./components/Search/SearchCard";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/columns";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { IContratos } from "@/shared/types/Querys/IContratos";
import { useState } from "react";

export default function DeclaracionesModule({
  empresas,
  declaraciones,
  contratos,
}: {
  empresas: IEmpresa[];
  declaraciones: IDeclaracion[];
  contratos: IContratos[];
}) {
  const [declaracionesState, setDeclaracionesState] = useState(declaraciones);

  const changeState = (updatedItem: IDeclaracion) => {
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
            Declaraciones Juradas
          </h2>
        </div>
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
