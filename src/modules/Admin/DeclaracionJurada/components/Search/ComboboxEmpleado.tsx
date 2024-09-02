import React from "react";
import { Label } from "@/components/ui/label";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";

export const ComboboxEmpleado = ({
  empleados,
  setEmployee,
  idEmployee,
}: {
  empleados: IEmpleado[];
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
        <option value="">Seleccionar empleado</option> {/* Opción predeterminada */}
        {empleados.map((empleado) => (
          <option key={empleado.id} value={empleado.id}>
            {empleado.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};
