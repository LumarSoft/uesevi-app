"use client";

import { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IAfiliado } from "@/shared/types/Querys/IAfiliado";
import {
  dniDeCuil,
  formatearCuil,
  formatearDni,
  nombreCompleto,
} from "../../helpers";

// Orden alfabético en castellano, sin distinguir mayúsculas ni tildes.
const alfabetico = new Intl.Collator("es", { sensitivity: "base" });

// Encabezado que ordena: un clic ascendente, otro descendente y el tercero
// vuelve al orden original (alfabético, o por relevancia si hay una búsqueda).
const EncabezadoOrdenable = ({
  column,
  titulo,
}: {
  column: Column<IAfiliado, unknown>;
  titulo: string;
}) => {
  const orden = column.getIsSorted();
  const Icono = orden === "asc" ? ArrowUp : orden === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <Button
      variant="ghost"
      className="-ml-4"
      onClick={column.getToggleSortingHandler()}
    >
      {titulo}
      <Icono className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const createColumns = (): ColumnDef<IAfiliado>[] => [
  {
    id: "nombre_completo",
    accessorFn: (afiliado) => nombreCompleto(afiliado),
    header: ({ column }) => (
      <EncabezadoOrdenable column={column} titulo="Apellido y nombre" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{nombreCompleto(row.original)}</span>
    ),
    sortingFn: (a, b) =>
      alfabetico.compare(nombreCompleto(a.original), nombreCompleto(b.original)),
  },
  {
    id: "dni",
    accessorFn: (afiliado) => Number(dniDeCuil(afiliado.cuil)) || 0,
    // TanStack ordena los números de mayor a menor en el primer clic; acá el
    // primer clic es ascendente, igual que en el resto de las columnas.
    sortDescFirst: false,
    header: ({ column }) => <EncabezadoOrdenable column={column} titulo="DNI" />,
    cell: ({ row }) => (
      <span className="tabular-nums">
        {formatearDni(dniDeCuil(row.original.cuil)) || "—"}
      </span>
    ),
  },
  {
    accessorKey: "cuil",
    header: ({ column }) => <EncabezadoOrdenable column={column} titulo="CUIL" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap tabular-nums">
        {formatearCuil(row.original.cuil)}
      </span>
    ),
  },
  {
    accessorKey: "categoria",
    header: ({ column }) => (
      <EncabezadoOrdenable column={column} titulo="Categoría" />
    ),
    cell: ({ row }) => row.original.categoria || "—",
    sortingFn: (a, b) =>
      alfabetico.compare(a.original.categoria, b.original.categoria),
  },
  {
    accessorKey: "nombre_empresa",
    header: ({ column }) => <EncabezadoOrdenable column={column} titulo="Empresa" />,
    cell: ({ row }) => row.original.nombre_empresa || "—",
    sortingFn: (a, b) =>
      alfabetico.compare(a.original.nombre_empresa, b.original.nombre_empresa),
  },
];
