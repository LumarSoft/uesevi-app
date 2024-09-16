import React from "react";
import { Label } from "@/components/ui/label";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";

export const ComboboxEmployee = ({
  employees,
  setEmployee,
}: {
  employees: IEmpleado[];
  setEmployee: (employee: number | null) => void;
}) => {
  return (
    <div className="space-y-2 w-full flex flex-col gap-2">
      <Label>Empleado</Label>
      <select
        className="px-4 py-2 bg-background border rounded-lg"
        onChange={(e) => setEmployee(Number(e.target.value))}
      >
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};
