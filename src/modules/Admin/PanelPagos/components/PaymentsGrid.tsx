"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GridRow } from "@/shared/types/PaymentsPanel";
import { formatCurrency, mesCorto } from "../helpers";
import MonthCell from "./MonthCell";
import { SearchX } from "lucide-react";

interface Props {
  rows: GridRow[];
  from: number;
  to: number;
  loading?: boolean;
}

// Anchos fijos (px) de las columnas que NO son de mes.
const EMPRESA_W = 220;
const TOTAL_W = 120;
const PEND_W = 80;
const MONTH_MIN_W = 130; // ancho mínimo por mes (dispara scroll cuando hay muchos)

export default function PaymentsGrid({ rows, from, to, loading }: Props) {
  const router = useRouter();
  const meses: number[] = [];
  for (let m = from; m <= to; m++) meses.push(m);

  // Ancho mínimo de la tabla: con table-fixed + w-full, si el contenedor es más
  // ancho, el espacio sobrante se reparte entre las columnas de mes (crecen);
  // si es más angosto, se respeta este mínimo y aparece scroll horizontal.
  const minWidth = EMPRESA_W + TOTAL_W + PEND_W + meses.length * MONTH_MIN_W;

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table className="w-full table-fixed" style={{ minWidth }}>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead
              className="sticky left-0 z-10 bg-muted/50 font-bold"
              style={{ width: EMPRESA_W }}
            >
              Empresa
            </TableHead>
            {meses.map((m) => (
              <TableHead key={m} className="text-center font-bold">
                {mesCorto(m)}
              </TableHead>
            ))}
            <TableHead className="text-right font-bold" style={{ width: TOTAL_W }}>
              Total año
            </TableHead>
            <TableHead className="text-center font-bold" style={{ width: PEND_W }}>
              Pend.
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={meses.length + 3} className="h-32 text-center">
                Cargando…
              </TableCell>
            </TableRow>
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <TableRow
                key={row.empresa_id}
                className="cursor-pointer hover:bg-muted/40"
              >
                <TableCell
                  className="sticky left-0 z-10 bg-background font-medium"
                  style={{ width: EMPRESA_W }}
                  onClick={() => router.push(`/admin/panel-pagos/${row.empresa_id}`)}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate" title={row.nombre}>
                      {row.nombre}
                    </span>
                    {row.estado_empresa === "Inactivo" && (
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        Inactiva
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{row.cuit}</span>
                </TableCell>

                {row.meses.map((cell) => (
                  <TableCell key={cell.mes} className="p-0 align-top">
                    <MonthCell cell={cell} />
                  </TableCell>
                ))}

                <TableCell
                  className="text-right font-semibold"
                  onClick={() => router.push(`/admin/panel-pagos/${row.empresa_id}`)}
                >
                  {formatCurrency(row.total_anio)}
                </TableCell>
                <TableCell className="text-center">
                  {row.meses_pendientes === 0 ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">
                      Al día
                    </Badge>
                  ) : (
                    <Badge variant="destructive">+{row.meses_pendientes}</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={meses.length + 3} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <SearchX className="mb-2 h-12 w-12 text-gray-400" />
                  <p className="text-lg font-medium">Sin resultados</p>
                  <p className="text-sm">
                    No se encontraron empresas que coincidan con tu búsqueda
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
