"use client";
import { Info } from "./components/Info/Info";
import { createColumns } from "./components/Table/Columns";
import { DataTable } from "./components/Table/Data-Table";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { Total } from "./components/Total/Total";

export const DeclaracionModule = ({
  statement,
  rate,
}: {
  statement: IInfoDeclaracion;
  rate: any;
}) => {
  const basicSalary = statement.sueldo_basico;
  const columns = createColumns(basicSalary);
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaracion jurada
          </h2>
        </div>
        <Info statement={statement} />
        <Total statement={statement} rate={rate} basicSalary={basicSalary} />
        <DataTable columns={columns} data={statement.empleados} />
      </div>
    </div>
  );
};
