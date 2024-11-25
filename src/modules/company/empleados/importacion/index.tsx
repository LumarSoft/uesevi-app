import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { ChargeAlert } from "./components/ChargeAlert";
import { InputFile } from "./components/InputFile";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// Función para calcular meses pendientes de declaración
function getMissingDeclarationMonths(
  monthLastDeclaration: number | undefined,
  yearLastDeclaration: number | undefined,
  currentMonth: number,
  currentYear: number
): number[] {
  // Si no hay última declaración, devolver el mes anterior al actual
  if (!monthLastDeclaration || !yearLastDeclaration) {
    return [currentMonth - 1];
  }

  // Array para almacenar meses pendientes
  const missingMonths: number[] = [];

  // Caso donde la última declaración es del mismo año
  if (yearLastDeclaration === currentYear) {
    // Iteramos desde el mes siguiente a la última declaración hasta el mes anterior al actual
    for (let month = monthLastDeclaration + 1; month < currentMonth; month++) {
      missingMonths.push(month);
    }
  }
  // Caso donde la última declaración es de un año anterior
  else if (yearLastDeclaration < currentYear) {
    // Primero agregamos todos los meses del año actual hasta el mes anterior al actual
    for (let month = 1; month < currentMonth; month++) {
      missingMonths.push(month);
    }
  }

  return missingMonths;
}

// Función para convertir número de mes a nombre de mes
const getMonthName = (monthNumber: number): string => {
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio", 
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return monthNames[monthNumber - 1];
};

export default function ImportacionEmpleadosModule({
  lastDeclaration,
}: {
  lastDeclaration: IDeclaracion | null;
}) {
  // Obtenemos el mes y anio de la última declaración
  const monthLastDeclaration = lastDeclaration?.mes;
  const yearLastDeclaration = lastDeclaration?.year;

  // Obtenemos el mes y anio actual
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Estado para almacenar los meses pendientes
  const [missingMonths, setMissingMonths] = useState<number[]>([]);
  const [missingMonthNames, setMissingMonthNames] = useState<string[]>([]);
  const [isFirstDeclaration, setIsFirstDeclaration] = useState<boolean>(false);
  const [isUpToDate, setIsUpToDate] = useState<boolean>(false);

  // Efecto para calcular meses pendientes
  useEffect(() => {
    // Verificar si es la primera declaración
    const isFirstTime = !monthLastDeclaration || !yearLastDeclaration;
    setIsFirstDeclaration(isFirstTime);

    const pendingMonths = getMissingDeclarationMonths(
      monthLastDeclaration,
      yearLastDeclaration,
      currentMonth,
      currentYear
    );

    setMissingMonths(pendingMonths);

    // Convertir números de mes a nombres de mes
    const pendingMonthNames = pendingMonths.map(getMonthName);
    setMissingMonthNames(pendingMonthNames);

    // Verificar si está al día (último mes cargado es el mes anterior al actual)
    setIsUpToDate(
      monthLastDeclaration === currentMonth - 1 &&
        yearLastDeclaration === currentYear
    );
  }, [monthLastDeclaration, yearLastDeclaration, currentMonth, currentYear]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Cargar declaración jurada
          </h2>
        </div>

        {/* Alerta para primera declaración */}
        {isFirstDeclaration && (
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Primera declaración</AlertTitle>
            <AlertDescription>
              Se cargará la declaración jurada de{" "}
              <span className="font-semibold text-yellow-300">
                {getMonthName(currentMonth - 1)} {currentYear}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta de meses pendientes */}
        {missingMonths.length > 0 && !isUpToDate && !isFirstDeclaration && (
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Declaraciones pendientes</AlertTitle>
            <AlertDescription>
              Necesitas cargar las declaraciones juradas de los siguientes
              meses:{" "}
              <span className="font-semibold text-yellow-300">
                {missingMonthNames.join(", ")}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta de declaraciones al día */}
        {isUpToDate ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Declaraciones al día</AlertTitle>
            <AlertDescription>
              No hay declaraciones juradas pendientes de carga.
            </AlertDescription>
          </Alert>
        ) : (
          <InputFile />
        )}

        <ChargeAlert />
      </div>
    </div>
  );
}