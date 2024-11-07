"use client";
import { createColumns } from "./components/Table/Columns";
import { DataTable } from "./components/Table/Data-Table";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { Total } from "./components/Total/Total";
import { Info } from "./components/Info/Info";

export const DeclaracionModule = ({
  statement,
  rate,
}: {
  statement: IInfoDeclaracion;
  rate: any;
}) => {
  const sueldoBasico = statement.sueldo_basico;

  const columns = createColumns(sueldoBasico);
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaracion jurada
          </h2>
        </div>
        <Info statement={statement} />
        <Total statement={statement} rate={rate} basicSalary={sueldoBasico} />
        <DataTable columns={columns} data={statement.empleados} />
      </div>
    </div>
  );
};
