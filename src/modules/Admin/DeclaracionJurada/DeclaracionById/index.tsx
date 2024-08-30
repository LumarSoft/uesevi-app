"use client";
import { Info } from "./components/Info/Info";
import { createColumns } from "./components/Table/Columns";
import { DataTable } from "./components/Table/Data-Table";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";

export const DeclaracionModule = ({
  declaracion,
}: {
  declaracion: IInfoDeclaracion;
}) => {
  const columns = createColumns();
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaracion jurada
          </h2>
        </div>
        <Info declaracion={declaracion} />
        <DataTable columns={columns} data={declaracion.empleados} />
      </div>
    </div>
  );
};
