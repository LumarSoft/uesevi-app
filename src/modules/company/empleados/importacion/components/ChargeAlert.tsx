import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

import React from "react";

export const ChargeAlert = () => {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md shadow-md">
      <div className="flex items-start">
        <div className="mr-4">
          <Terminal className="text-yellow-500 h-8 w-8" />
        </div>
        <div className="flex-1">
          <AlertTitle className="text-2xl font-bold mb-2 dark:text-black">
            Reglas para el completado de la planilla de empleados
          </AlertTitle>
          <AlertDescription className="text-gray-700 leading-relaxed">
            <p className="mb-4">
              No contara con una vista previa antes de la carga. Revise los
              valores de las declaraciones juradas desde el Excel previamente a
              ser cargado ya que será el que sistema tomara. En caso de cambios
              deberá RECTIFICAR
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Apellido, Nombre, CUIL, Adhesion al sindicato, Categoria son
                campos OBLIGATORIOS.
              </li>
              <li>
                El campo adhesión al sindicato debe indicar una opción del
                selector. (Si / NO)
              </li>
              <li>
                El campo Categoria debe indicar una opción del selector. ej: (
                Vigilador Principal ){" "}
                <span className="font-bold">No tipear la categoria</span>
              </li>
              <li>El campo Sueldo Basico no debe ser un valor 0</li>
              <li>El CUIL NO puede contener guiones ni puntos.</li>
              <li>El CUIL NO puede ser 00-0000000-0</li>
            </ul>
          </AlertDescription>
          <div className="mt-4">
            <a href="/importar-ejemplo.xlsx" download>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white transition">
                Descargar ejemplo de archivo
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
