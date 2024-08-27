import React from "react";
import { Label } from "@/components/ui/label";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";

export const ComboboxEmpleado = ({
  empleados,
  employee,
  setEmployee,
}: {
  empleados: IEmpleado[];
  employee: string | IEmpleado;
  setEmployee: (employee: string | IEmpleado) => void;
}) => {
  return (
    <div className="space-y-2 w-full flex flex-col gap-2">
      <Label>Empleado</Label>
      <select
        className="px-4 py-2 bg-background border rounded-lg"
        value={typeof employee === "string" ? employee : employee.id}
        onChange={(e) => {
          const selectedEmployee = empleados.find(
            (empleado) => empleado.id === Number(e.target.value)
          );
          setEmployee(selectedEmployee || e.target.value);
        }}
      >
        {empleados.map((empleado) => (
          <option key={empleado.id} value={empleado.id}>
            {empleado.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};
