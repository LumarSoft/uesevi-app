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
        <option value="">Seleccionar empleado</option>{" "}
        {/* Opción predeterminada */}
        {employees.map((employee) => (
          <option key={employee.id} value={employee.empleado_id}>
            {employee.nombre} {employee.apellido}
          </option>
        ))}
      </select>
    </div>
  );
};
