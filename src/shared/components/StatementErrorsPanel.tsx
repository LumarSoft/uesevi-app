"use client";

import { AlertTriangle, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { RowError } from "@/shared/utils/validateStatementRows";

/**
 * Panel de errores de la carga de una declaración jurada.
 *
 * Antes los errores se mostraban en un toast que juntaba todo con "\n" (los
 * toasts no respetan los saltos de línea), se cortaba a los 5 y desaparecía
 * solo. Acá quedan fijos en pantalla, agrupados por fila del Excel y con el
 * campo que hay que corregir.
 */
export const StatementErrorsPanel = ({
  errors,
  title = "No se pudo cargar la declaración jurada",
  onDismiss,
}: {
  errors: RowError[];
  title?: string;
  onDismiss?: () => void;
}) => {
  if (!errors || errors.length === 0) return null;

  // Errores generales (sin fila) primero, después agrupados por fila.
  const generalErrors = errors.filter((error) => !error.fila);
  const rowErrors = errors.filter((error) => error.fila);

  const byRow = new Map<number, RowError[]>();
  rowErrors.forEach((error) => {
    const fila = error.fila as number;
    byRow.set(fila, [...(byRow.get(fila) || []), error]);
  });

  const rows = Array.from(byRow.keys()).sort((a, b) => a - b);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-lg border border-red-300 bg-red-50 p-5"
    >
      <div className="flex items-start gap-3">
        <XCircle className="h-6 w-6 flex-shrink-0 text-red-600" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-red-800">{title}</h3>
          <p className="text-sm text-red-700">
            {errors.length === 1
              ? "Se encontró 1 error en el archivo."
              : `Se encontraron ${errors.length} errores en el archivo.`}{" "}
            No se guardó ningún dato: corregí el Excel y volvé a subirlo.
          </p>
        </div>
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="flex-shrink-0 text-red-700 hover:bg-red-100 hover:text-red-800"
          >
            Cerrar
          </Button>
        )}
      </div>

      <ScrollArea className="mt-4 max-h-72 pr-3">
        <ul className="space-y-2">
          {generalErrors.map((error, index) => (
            <li
              key={`general-${index}`}
              className="flex items-start gap-2 rounded-md bg-white/70 p-3 text-sm text-red-800"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
              <span>{error.mensaje}</span>
            </li>
          ))}

          {rows.map((fila) => (
            <li
              key={`fila-${fila}`}
              className="rounded-md bg-white/70 p-3 text-sm text-red-800"
            >
              <p className="font-semibold">Fila {fila} del Excel</p>
              <ul className="mt-1 space-y-1">
                {(byRow.get(fila) || []).map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                    <span>
                      {error.campo && (
                        <span className="font-medium">{error.campo}: </span>
                      )}
                      {error.mensaje}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default StatementErrorsPanel;
