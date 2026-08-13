"use client";

import { useEffect, useRef, useState } from "react";
import { MesCelda, PanelMode } from "@/shared/types/PaymentsPanel";
import { formatCurrency, formatFecha, mesCorto } from "../helpers";
import { ChevronDown } from "lucide-react";

interface Props {
  cell: MesCelda;
  mode?: PanelMode;
}

const estadoColor: Record<string, string> = {
  Pagado: "text-emerald-500",
  Pendiente: "text-amber-500",
  "Sin DDJJ": "text-gray-400",
  "Sin movimiento": "text-gray-400",
};

// Celda con monto + fecha. El desglose aparece como popup flotante
// para no alterar la altura de la fila de la tabla.
export default function MonthCell({ cell, mode = "periodo" }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const esCaja = mode === "caja";
  // En período: "Sin DDJJ" = no hay declaración. En caja: no entró plata ese mes.
  const vacio = esCaja ? cell.monto === 0 : cell.estado === "Sin DDJJ";
  const periodos = cell.periodos ?? [];

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  if (vacio) {
    return (
      <div className="w-full px-2 py-2 text-center">
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {esCaja ? "—" : "Sin DDJJ"}
        </span>
      </div>
    );
  }

  // Segunda línea: en caja, la fecha si es un único pago o "N pagos" si son varios.
  const subLinea = esCaja
    ? periodos.length > 1
      ? `${periodos.length} pagos`
      : cell.fecha_pago
      ? formatFecha(cell.fecha_pago)
      : "—"
    : cell.fecha_pago
    ? formatFecha(cell.fecha_pago)
    : "—";

  return (
    <div ref={wrapRef} className="relative w-full px-2 py-2">
      {/* Botón principal: monto + fecha en dos líneas compactas */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full flex-col items-start rounded px-1 py-0.5 text-left hover:bg-muted/60 transition-colors"
        title={esCaja ? "Ver períodos cobrados" : "Ver desglose"}
      >
        <span className={`text-sm font-semibold whitespace-nowrap leading-tight ${estadoColor[cell.estado] ?? "text-emerald-500"}`}>
          {formatCurrency(cell.monto)}
          <ChevronDown
            className={`ml-1 inline h-3 w-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap leading-tight mt-0.5">
          {subLinea}
        </span>
      </button>

      {/* Popup flotante — no modifica la altura de la fila */}
      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-md border bg-popover shadow-lg p-2 space-y-1 text-sm"
        >
          {esCaja ? (
            <>
              <div className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                Períodos cobrados
              </div>
              {periodos.map((p) => (
                <div
                  key={p.mes}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-muted-foreground whitespace-nowrap shrink-0">
                    {mesCorto(p.mes)}
                    {p.fecha_pago && (
                      <span className="ml-1 text-[10px]">
                        ({formatFecha(p.fecha_pago)})
                      </span>
                    )}
                  </span>
                  <span className="font-medium whitespace-nowrap tabular-nums">
                    {formatCurrency(p.monto)}
                  </span>
                </div>
              ))}
              <div className="mt-1 flex items-center justify-between gap-4 border-t pt-1">
                <span className="font-semibold">Total</span>
                <span className="font-semibold whitespace-nowrap tabular-nums">
                  {formatCurrency(cell.monto)}
                </span>
              </div>
            </>
          ) : (
            <>
              <Linea label="FAS" value={cell.fas} />
              <Linea label="Ap. Solidario" value={cell.solidario} />
              <Linea label="Cuota Sindical" value={cell.sindical} />
              {cell.intereses > 0 && (
                <Linea label="Intereses" value={cell.intereses} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

const Linea = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-muted-foreground whitespace-nowrap shrink-0">{label}</span>
    <span className="font-medium whitespace-nowrap tabular-nums">{formatCurrency(value)}</span>
  </div>
);
