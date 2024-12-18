import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { ChargeAlert } from "./components/ChargeAlert";
import { InputFile } from "./components/InputFile";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Función para calcular meses pendientes de declaración
function getMissingDeclarationMonths(
  monthLastDeclaration: number | undefined,
  yearLastDeclaration: number | undefined,
  currentMonth: number,
  currentYear: number
): { year: number; month: number }[] {
  const missingMonths: { year: number; month: number }[] = [];

  // Si no hay una última declaración registrada
  if (!monthLastDeclaration || !yearLastDeclaration) {
    return [{ year: currentYear, month: currentMonth - 1 }];
  }

  let year = yearLastDeclaration;
  let month = monthLastDeclaration + 1;

  // Iterar desde la última declaración hasta el mes anterior al actual, y las declaraciones faltantes agregarlas al array.
  // Ejemplo: Si tengo declaraciones en agosto y octubre de 2024, me debe aparecer que debo septiembre y noviembre, teniendo en cuenta que estamos en diciembre (las declaraciones funcionan a mes vencido).
  while (!(month === currentMonth && year === currentYear)) {
    if (month > 12) {
      month = 1;
      year++;
    }

    missingMonths.push({ year, month });
    month++;
  }

  return missingMonths;
}

// Función para convertir número de mes a nombre de mes
const getMonthName = (monthNumber: number): string => {
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return monthNames[monthNumber - 1];
};

export default function ImportacionEmpleadosModule({
  lastDeclaration,
}: {
  lastDeclaration: IDeclaracion | null;
}) {
  // Obtenemos el mes y año de la última declaración
  const monthLastDeclaration = lastDeclaration?.mes;
  const yearLastDeclaration = lastDeclaration?.year;

  // Obtenemos el mes y año actual
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Estados para manejar meses pendientes y selección
  const [missingMonths, setMissingMonths] = useState<{ year: number; month: number }[]>([]);
  const [missingMonthNames, setMissingMonthNames] = useState<string[]>([]);
  const [isFirstDeclaration, setIsFirstDeclaration] = useState<boolean>(false);
  const [isUpToDate, setIsUpToDate] = useState<boolean>(false);

  // Nuevos estados para selección de mes
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

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
    const pendingMonthNames = pendingMonths.map((m) => getMonthName(m.month));
    setMissingMonthNames(pendingMonthNames);

    // Verificar si está al día
    setIsUpToDate(
      monthLastDeclaration === currentMonth - 1 &&
      yearLastDeclaration === currentYear
    );

    // Establecer valores por defecto para selección
    if (pendingMonths.length > 0) {
      setSelectedMonth(pendingMonths[0].month);
    }
  }, [monthLastDeclaration, yearLastDeclaration, currentMonth, currentYear]);

  // Generar años para selector
  const years = Array.from(
    { length: 5 }, 
    (_, i) => currentYear - i
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Cargar declaración jurada
          </h2>
        </div>

        {/* Alerta de meses pendientes */}
        {missingMonths.length > 0 && !isUpToDate && !isFirstDeclaration && (
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Declaraciones pendientes</AlertTitle>
            <AlertDescription>
              Tienes declaraciones pendientes de carga:{" "}
              <span className="font-semibold text-yellow-300">
                {missingMonthNames.join(", ")}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Selectores de mes */}
        {missingMonths.length > 0 && !isUpToDate && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Mes
              </label>
              <Select
                value={selectedMonth ? selectedMonth.toString() : undefined}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  {missingMonths.map((m) => (
                    <SelectItem key={`${m.year}-${m.month}`} value={m.month.toString()}>
                      {getMonthName(m.month)} ({m.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Input para subir archivos */}
        <InputFile selectedMonth={selectedMonth} />

        {/* Componente para alertas */}
        <ChargeAlert />
      </div>
    </div>
  );
}
