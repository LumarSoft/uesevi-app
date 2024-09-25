"use client";

import { AddEmployee } from "./components/AddEmployee";



export default function AgregarEmpleadosModule() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Agregar empleado
          </h2>
        </div>

        <AddEmployee/>
      </div>
    </div>
  );
}
