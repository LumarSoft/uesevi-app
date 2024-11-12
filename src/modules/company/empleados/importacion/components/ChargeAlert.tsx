import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

import React from "react";

export const ChargeAlert = () => {

  return (
    <div className="flex flex-col items-start  space-y-2 sm:space-y-0 sm:space-x-4 mt-6 mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200 shadow-sm">

      <AlertTitle className="text-3xl ">
        Reglas para el completado de la planilla de empleados
      </AlertTitle>
      <AlertDescription className="space-y-4">
        <p>No contara con una vista previa antes de la carga. Revise los valores de las declaraciones juradas desde el Excel previamente a ser cargado ya que será el que sistema tomara. En caso de cambios deberá RECTIFICAR</p>
        <ul className="list-disc pl-5">
          <li>
            Apellido, Nombre, CUIL, Adhesion al sindicato, Categoria son campos
            OBLIGATORIOS.
          </li>
          <li>
            EI campo adhesión al sindicato debe indicar una opcion del selector.
            (Si / NO)
          </li>
          <li>
            El campo Categoria debe indicar una opcion del selector. ej: (
            Vigilador Principal ) <span> <b>No tipear la categoria</b> </span>
          </li>
          <li>El campo Sueldo Basico no debe ser un valor O</li>
          <li>El CUIL NO puede contener guiones ni puntos.</li>
          <li>El CUIL NO puede ser 00-0000000-0</li>
        </ul>
      </AlertDescription>
      <a href="/importar-ejemplo.xlsx" download>
        <Button className="bg-yellow-600 hover:bg-yellow-700 transition mt-3">Descargar ejemplo de archivo</Button>
      </a>
    </div>
  );
};
