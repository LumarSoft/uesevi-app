import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";

const MonthSelect = ({ 
  lastDeclaration,
  onMonthSelect 
}: { 
  lastDeclaration: IDeclaracion | null;
  onMonthSelect: (month: number, year: number) => void;
}) => {


  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  
  // Función para obtener los meses disponibles
  const getAvailableMonths = () => {
    const availableMonths = [];
    
    if (!lastDeclaration) {
      // Si no hay declaración previa y estamos en enero
      if (currentMonth === 1) {
        return [{
          month: 12,
          year: currentYear - 1,
          label: `Diciembre ${currentYear - 1}`
        }];
      }
      // Si no hay declaración previa y no estamos en enero
      return [{
        month: currentMonth - 1,
        year: currentYear,
        label: `${getMonthName(currentMonth - 1)} ${currentYear}`
      }];
    }

    let startMonth = lastDeclaration.mes;
    let startYear = lastDeclaration.year;


    // Avanzamos al siguiente mes después de la última declaración
    if (startMonth === 12) {
      startMonth = 1;
      startYear++;
    } else {
      startMonth++;
    }

    // Agregamos meses hasta el mes anterior al actual
    while (
      (startYear < currentYear) || 
      (startYear === currentYear && startMonth < currentMonth)
    ) {
      availableMonths.push({
        month: startMonth,
        year: startYear,
        label: `${getMonthName(startMonth)} ${startYear}`
      });

      if (startMonth === 12) {
        startMonth = 1;
        startYear++;
      } else {
        startMonth++;
      }
    }

    return availableMonths;
  };

  const availableMonths = getAvailableMonths();

  // Función para convertir número de mes a nombre
  function getMonthName(month: number) {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[month - 1];
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Seleccione el mes a declarar
      </label>
      <Select 
        onValueChange={(value) => {
          const [month, year] = value.split('-').map(Number);
          onMonthSelect(month, year);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione un mes" />
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((item) => (
            <SelectItem 
              key={`${item.month}-${item.year}`} 
              value={`${item.month}-${item.year}`}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonthSelect;