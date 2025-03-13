import { ChargeAlert } from "./components/ChargeAlert";
import { InputFile } from "./components/InputFile";
import { useState, useEffect, useRef } from "react";
import { Info, AlertCircle, CheckCircle2 } from "lucide-react";
import MonthSelect from "./components/MonthSelect";
import UpdatedExcelDialog from "./components/UpdateExcelDialog";

export interface IMissingStatements {
  mes: number;
  year: number;
}

export interface IStatementResponse {
  status: "NO_STATEMENTS" | "UP_TO_DATE" | "PENDING_STATEMENTS";
  message: string;
  data: IMissingStatements[];
}

export default function ImportacionEmpleadosModule({
  statementsData,
}: {
  statementsData: IStatementResponse | null;
}) {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Inicializa la ref correctamente en el primer renderizado
  const prevStatusRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Solo en el primer renderizado, inicializa la ref sin resetear valores
    if (prevStatusRef.current === undefined && statementsData?.status) {
      prevStatusRef.current = statementsData.status;
      console.log("Primera inicialización, status:", statementsData.status);
      return; // No resetear nada en la primera carga
    }

    // Para cambios posteriores
    const currentStatus = statementsData?.status;
    if (currentStatus && prevStatusRef.current !== currentStatus) {
      console.log(
        "Status cambiado de",
        prevStatusRef.current,
        "a",
        currentStatus
      );
      setSelectedMonth(null);
      setSelectedYear(null);
      prevStatusRef.current = currentStatus;
    }
  }, [statementsData?.status]);

  const handleMonthSelect = (month: number, year: number) => {
    if (typeof month === "number" && typeof year === "number") {
      setSelectedMonth(() => month);
      setSelectedYear(() => year);
      console.log("Mes seleccionado:", month, year);
    } else {
      console.error("Valores inválidos recibidos:", month, year);
    }
  };

  if (!statementsData) return null;

  const renderStatusMessage = () => {
    switch (statementsData.status) {
      case "NO_STATEMENTS":
        return (
          <div className="rounded-lg border bg-yellow-50 p-4 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
            <p className="text-yellow-700">
              No hay declaraciones juradas previas. Por favor, comience cargando
              el mes anterior.
            </p>
          </div>
        );
      case "UP_TO_DATE":
        return (
          <div className="rounded-lg border bg-green-50 p-4 flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <p className="text-green-700">
              Todas las declaraciones juradas están al día. No hay períodos
              pendientes para cargar.
            </p>
          </div>
        );
      case "PENDING_STATEMENTS":
        return (
          <div className="rounded-lg border bg-blue-50 p-4 flex items-center gap-3">
            <Info className="h-6 w-6 text-blue-600" />
            <p className="text-blue-700">
              Hay declaraciones juradas pendientes. Por favor, seleccione un
              período para cargar.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Modal dialog that shows on first visit */}
      <UpdatedExcelDialog />

      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Cargar declaración jurada
          </h2>
        </div>

        {/* Always show the alert at the top */}

        {renderStatusMessage()}

        {(statementsData.status === "NO_STATEMENTS" ||
          statementsData.status === "PENDING_STATEMENTS") && (
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
        )}

        {(statementsData.status === "NO_STATEMENTS" ||
          statementsData.status === "PENDING_STATEMENTS") && (
          <MonthSelect
            statementsData={statementsData}
            onMonthSelect={handleMonthSelect}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        )}

        {selectedMonth && selectedYear && (
          <InputFile month={selectedMonth} year={selectedYear} />
        )}
        <ChargeAlert />
      </div>
    </div>
  );
}
