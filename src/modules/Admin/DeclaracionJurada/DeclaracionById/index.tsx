"use client";
import { useRouter } from "next/navigation";
import { Info } from "./components/Info/Info";
import { createColumns } from "./components/Table/Columns";
import { DataTable } from "./components/Table/Data-Table";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { Total } from "./components/Total/Total";
import PDFDownloadButton from "./components/PDFDownloadButton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export const DeclaracionModule = ({
  statement,
  rate,
}: {
  statement: IInfoDeclaracion;
  rate: any;
}) => {
  console.log(statement);

  const router = useRouter();
  const sueldoBasico = statement.sueldo_basico;

  // Pasamos mes/year para que el aporte solidario use la fórmula vigente al
  // período de la declaración (versionada, ver shared/utils/aportes.ts).
  // Se pasa la FECHA DE CARGA (no el período) para elegir la fórmula del
  // aporte solidario. Ver shared/utils/aportes.ts.
  const columns = createColumns(sueldoBasico, statement.fecha_carga);
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* router.back() en vez de una ruta fija: esta pantalla se abre desde
            el listado de declaraciones, el historial y el panel de pagos, así
            que "volver" tiene que respetar de dónde vino cada vez. */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Volver
        </Button>
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
