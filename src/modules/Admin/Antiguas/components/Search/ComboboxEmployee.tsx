import React from "react";
import { Label } from "@/components/ui/label";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";

export const ComboboxEmployee = ({
  employees,
  setEmployee,
  idEmployee,
}: {
  employees: IEmpleado[];
  setEmployee: (employee: number | null) => void;
  idEmployee: number | null;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Si el valor es "0", no se debe filtrar por empleado
    setEmployee(value === "0" ? null : Number(value));
  };

  return (
    <div className="space-y-2 w-full flex flex-col gap-2">
      <Label>Empleado</Label>
      <select
        className="px-4 py-2 bg-background border rounded-lg"
        value={idEmployee || ""} 
        onChange={(e) => {
          const value = e.target.value === "" ? null : Number(e.target.value);
          setEmployee(value);
        }}
      >
         <option value="">Seleccionar empleado</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};