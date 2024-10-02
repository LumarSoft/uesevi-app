import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";

import React from "react";

export const ChargeAlert = () => {
  return (
    <Alert className="spacey">
      <Terminal className="h-4 w-4" />
      <AlertTitle>
        Reglas para la rectificacion de declaracion jurada
      </AlertTitle>
      <AlertDescription className="space-y-4">
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
            Vigilador Principal )
          </li>
          <li>El campo Sueldo Basico no debe ser un valor O</li>
          <li>El CUIL NO puede contener guiones ni puntos.</li>
          <li>El CUIL NO puede ser 00-0000000-0</li>
        </ul>
      </AlertDescription>
      <a href="/importar-ejemplo.xlsx" download>
        <Button>Descargar ejemplo de archivo</Button>
      </a>
    </Alert>
  );
};
