import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IStatementResponse } from "..";

const MonthSelect = ({
  statementsData,
  onMonthSelect,
  selectedMonth,
  selectedYear,
}: {
  statementsData: IStatementResponse;
  onMonthSelect: (month: number, year: number) => void;
  selectedMonth: number | null;
  selectedYear: number | null;
}) => {
  function getMonthName(month: number) {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];
    return months[month - 1];
  }

  function getPreviousMonth() {
    const currentDate = new Date();
    const previousMonth = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1)
    );
    return {
      month: previousMonth.getMonth() + 1,
      year: previousMonth.getFullYear(),
    };
  }

  useEffect(() => {
    if (statementsData.status === "NO_STATEMENTS" && (!selectedMonth || !selectedYear)) {
      const { month, year } = getPreviousMonth();
      onMonthSelect(month, year);
    }
  }, [statementsData, selectedMonth, selectedYear, onMonthSelect]);

  // Para el caso NO_STATEMENTS, mostrar solo diciembre del año anterior
  if (statementsData.status === "NO_STATEMENTS") {
    const { month, year } = getPreviousMonth();
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Mes a cargar
        </label>
        <Select
          value={`${month}-${year}`}
          onValueChange={(value) => {
            const [month, year] = value.split("-").map(Number);
            onMonthSelect(month, year);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={`${month}-${year}`}>
              {`${getMonthName(month)} ${year}`}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Para PENDING_STATEMENTS, mostrar la lista de meses faltantes
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Seleccione el mes a declarar
      </label>
      <Select
        value={
          selectedMonth && selectedYear
            ? `${selectedMonth}-${selectedYear}`
            : undefined
        }
        onValueChange={(value) => {
          const [month, year] = value.split("-").map(Number);
          onMonthSelect(month, year);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione un mes" />
        </SelectTrigger>
        <SelectContent>
          {statementsData.data.map((item) => (
            <SelectItem
              key={`${item.mes}-${item.year}`}
              value={`${item.mes}-${item.year}`}
            >
              {`${getMonthName(item.mes)} ${item.year}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthSelect;