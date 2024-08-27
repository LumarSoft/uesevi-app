"use client";

import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import SearchCard from "./components/Search/SearchCard";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/columns";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";

export default function DeclaracionesModule({
  empleados,
  empresas,
  declaraciones,
}: {
  empleados: IEmpleado[];
  empresas: IEmpresa[];
  declaraciones: IDeclaracion[];
}) {
  const columns = createColumns();

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaraciones Juradas
          </h2>
        </div>
        <SearchCard empleados={empleados} empresas={empresas} />
        <DataTable
          columns={columns}
          data={declaraciones || []}
          filterColumn="nombre_empresa"
        />
      </div>
    </div>
  );
}
