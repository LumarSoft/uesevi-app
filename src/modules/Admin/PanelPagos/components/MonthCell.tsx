"use client";

import { useState } from "react";
import { MesCelda } from "@/shared/types/PaymentsPanel";
import { formatCurrency, formatFecha } from "../helpers";
import { ChevronDown } from "lucide-react";

interface Props {
  cell: MesCelda;
}

const estadoColor: Record<string, string> = {
  Pagado: "text-emerald-600",
  Pendiente: "text-amber-600",
  "Sin DDJJ": "text-gray-400",
};

// Celda de dos líneas (monto arriba, fecha abajo) con desglose colapsable.
export default function MonthCell({ cell }: Props) {
  const [open, setOpen] = useState(false);
  const sinDdjj = cell.estado === "Sin DDJJ";

  if (sinDdjj) {
    return (
      <div className="min-w-[110px] px-2 py-1 text-center">
        <span className="text-sm text-gray-400">Sin DDJJ</span>
      </div>
    );
  }

  return (
    <div className="min-w-[120px] px-2 py-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full flex-col items-start rounded px-1 py-0.5 text-left hover:bg-muted/60"
        title="Ver desglose"
      >
        <span className={`text-sm font-semibold ${estadoColor[cell.estado]}`}>
          {formatCurrency(cell.monto)}
          <ChevronDown
            className={`ml-1 inline h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
        <span className="text-xs text-muted-foreground">
          {cell.fecha_pago ? formatFecha(cell.fecha_pago) : "—"}
        </span>
      </button>

      {open && (
        <div className="mt-1 space-y-0.5 rounded bg-muted/50 p-2 text-xs">
          <Linea label="FAS" value={cell.fas} />
          <Linea label="Ap. Solidario" value={cell.solidario} />
          <Linea label="Cuota Sindical" value={cell.sindical} />
          <Linea label="Intereses" value={cell.intereses} />
        </div>
      )}
    </div>
  );
}

const Linea = ({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between gap-3">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{formatCurrency(value)}</span>
  </div>
);
