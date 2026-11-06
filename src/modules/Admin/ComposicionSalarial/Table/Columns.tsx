"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IComposicionSalarial } from "@/shared/types/Querys/IComposicionSalarial";
import {
  colorConcepto,
  formatearMonto,
  nombrePeriodo,
} from "@/shared/utils/composicionSalarial";
import { ComposicionDialog } from "../Dialog/ComposicionDialog";
import { Delete } from "../AlertDialogs/Delete";

const HeaderOrdenable = ({
  column,
  children,
}: {
  column: { toggleSorting: (desc: boolean) => void; getIsSorted: () => false | string };
  children: React.ReactNode;
}) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {children}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

export const createColumns = (
  onDataUpdate: (item: IComposicionSalarial) => void,
  onDataDelete: (item: IComposicionSalarial) => void
): ColumnDef<IComposicionSalarial>[] => [
  {
    id: "periodo",
    // Valor numérico para ordenar bien; el filtro de texto usa el nombre.
    accessorFn: (row) => nombrePeriodo(row.mes, row.year),
    sortingFn: (a, b) =>
      a.original.year * 12 + a.original.mes - (b.original.year * 12 + b.original.mes),
    header: ({ column }) => <HeaderOrdenable column={column}>Período</HeaderOrdenable>,
    cell: ({ row }) => (
      <span className="font-medium">
        {nombrePeriodo(row.original.mes, row.original.year)}
      </span>
    ),
  },
  {
    accessorKey: "categoria",
    header: ({ column }) => <HeaderOrdenable column={column}>Categoría</HeaderOrdenable>,
  },
  {
    id: "conceptos",
    header: "Conceptos",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {row.original.conceptos.map((c, i) => (
          <span key={`${c.nombre}-${i}`} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: colorConcepto(i).fill }}
            />
            <span className="text-muted-foreground">{c.nombre}</span>
            <span className="tabular-nums">{formatearMonto(c.monto)}</span>
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "total",
    header: ({ column }) => <HeaderOrdenable column={column}>Total</HeaderOrdenable>,
    cell: ({ row }) => (
      <span className="font-semibold tabular-nums">
        {formatearMonto(row.original.total)}
      </span>
    ),
  },
  {
    accessorKey: "publicado",
    header: "Estado",
    cell: ({ row }) =>
      row.original.publicado ? (
        <Badge className="bg-emerald-600 hover:bg-emerald-600">Publicado</Badge>
      ) : (
        <Badge variant="outline">Borrador</Badge>
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <ComposicionDialog data={row.original} onSaved={onDataUpdate} />
        <Delete data={row.original} onDataDelete={onDataDelete} />
      </div>
    ),
  },
];
