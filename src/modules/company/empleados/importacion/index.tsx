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
  SelectValue,
} from "@/components/ui/select";

// Función para obtener todos los meses faltantes entre declaraciones
function getMissingDeclarationMonths(declarations: IDeclaracion[]): { year: number; month: number }[] {
  if (!declarations || declarations.length === 0) return [];

  const missingMonths: { year: number; month: number }[] = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Ordenar declaraciones por año y mes
  const sortedDeclarations = [...declarations].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.mes - b.mes;
  });

  // Encontrar los huecos entre declaraciones
  for (let i = 0; i < sortedDeclarations.length - 1; i++) {
    const currentDecl = sortedDeclarations[i];
    const nextDecl = sortedDeclarations[i + 1];

    let year = currentDecl.year;
    let month = currentDecl.mes + 1;

    while (!(year === nextDecl.year && month === nextDecl.mes)) {
      if (month > 12) {
        month = 1;
        year++;
      }
      
      // Solo agregar si no es el mes actual
      if (!(month === currentMonth && year === currentYear)) {
        missingMonths.push({ year, month });
      }
      
      month++;
    }
  }

  // Verificar meses faltantes después de la última declaración
  const lastDecl = sortedDeclarations[sortedDeclarations.length - 1];
  let year = lastDecl.year;
  let month = lastDecl.mes + 1;

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
  lastDeclarations,
}: {
  lastDeclarations: IDeclaracion[] | null;
}) {
  // Estados
  const [missingMonths, setMissingMonths] = useState<{ year: number; month: number }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    if (lastDeclarations && lastDeclarations.length > 0) {
      const pending = getMissingDeclarationMonths(lastDeclarations);
      setMissingMonths(pending);

      // Establecer valores por defecto para selección
      if (pending.length > 0) {
        setSelectedMonth(pending[0].month);
        setSelectedYear(pending[0].year);
      }
    }
  }, [lastDeclarations]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Cargar declaración jurada
          </h2>
        </div>

        {/* Alerta de meses pendientes */}
        {missingMonths.length > 0 && (
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Declaraciones pendientes</AlertTitle>
            <AlertDescription>
              Tienes declaraciones pendientes de carga:{" "}
              <span className="font-semibold text-yellow-300">
                {missingMonths.map(m => `${getMonthName(m.month)} ${m.year}`).join(", ")}
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Selectores de mes */}
        {missingMonths.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Mes
              </label>
              <Select
                value={selectedMonth ? `${selectedMonth}-${selectedYear}` : undefined}
                onValueChange={(value) => {
                  const [month, year] = value.split('-').map(Number);
                  setSelectedMonth(month);
                  setSelectedYear(year);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  {missingMonths.map((m) => (
                    <SelectItem
                      key={`${m.year}-${m.month}`}
                      value={`${m.month}-${m.year}`}
                    >
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