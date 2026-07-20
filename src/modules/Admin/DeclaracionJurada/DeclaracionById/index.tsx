"use client";
import { Info } from "./components/Info/Info";
import { createColumns } from "./components/Table/Columns";
import { DataTable } from "./components/Table/Data-Table";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { Total } from "./components/Total/Total";
import PDFDownloadButton from "./components/PDFDownloadButton";

export const DeclaracionModule = ({
  statement,
  rate,
}: {
  statement: IInfoDeclaracion;
  rate: any;
}) => {
  console.log(statement);

  const sueldoBasico = statement.sueldo_basico;

  // Pasamos mes/year para que el aporte solidario use la fórmula vigente al
  // período de la declaración (versionada, ver shared/utils/aportes.ts).
  const columns = createColumns(sueldoBasico, statement.mes, statement.year);
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaración jurada
          </h2>
        </div>
        <PDFDownloadButton
          data={statement}
          rate={rate}
          basicSalary={sueldoBasico}
        /> 
        <Info statement={statement} />
        <Total statement={statement} rate={rate} basicSalary={sueldoBasico} />
        <DataTable columns={columns} data={statement.empleados} />
      </div>
    </div>
  );
};
