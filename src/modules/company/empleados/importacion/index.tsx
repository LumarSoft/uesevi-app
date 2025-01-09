import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { ChargeAlert } from "./components/ChargeAlert";
import { InputFile } from "./components/InputFile";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import MonthSelect from "./components/MonthSelect";

export default function ImportacionEmpleadosModule({
  lastDeclaration,
}: {
  lastDeclaration: IDeclaracion | null;
}) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const handleMonthSelect = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Cargar declaración jurada
          </h2>
        </div>

        <div className="rounded-lg border text-card-foreground shadow-2xl">
          <div className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-yellow-100 p-2">
              <Info className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-xl">Seleccione un mes</h3>
              <p className="text-lg">
                Para cargar una declaración jurada, primero debe{" "}
                <b className="text-yellow-600"> seleccionar el mes</b>{" "}
                correspondiente.
              </p>
            </div>
          </div>
        </div>

        <MonthSelect
          lastDeclaration={lastDeclaration}
          onMonthSelect={handleMonthSelect}
        />

        {selectedMonth && <InputFile month={selectedMonth} year={selectedYear} />}
        <ChargeAlert />
      </div>
    </div>
  );
}
