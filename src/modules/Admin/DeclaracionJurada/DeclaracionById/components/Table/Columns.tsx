"use client";

import { Empleado } from "@/shared/types/Querys/IInfoDeclaracion";
import { ColumnDef } from "@tanstack/react-table";

export const createColumns = (): ColumnDef<Empleado>[] => [
  {
    header: "Nombre",
    accessorKey: "nombre_completo",
  },
  {
    header: "Afiliado",
    accessorKey: "afiliado",
  },
  {
    header: "CUIL",
    accessorKey: "cuil",
  },
  {
    header: "Sueldo basico",
    cell: ({ row }) => {
      return <>${row.original.sueldo_basico}</>;
    },
  },
  {
    header: "Remunerativo adicional",
    cell: ({ row }) => {
      return <>${row.original.remunerativo_adicional}</>;
    },
  },
  {
    header: "Categoria",
    accessorKey: "categoria",
  },
  {
    header: "Adicional",
    cell: ({ row }) => {
      return <>${row.original.adicional}</>;
    },
  },
  {
    header: "Total bruto",
    cell: ({ row }) => {
      return <>${row.original.total_bruto}</>;
    },
  },
  {
    header: "Aporte extraordinario",
  },
  {
    header: "FAS",
  },
  {
    header: "Aporte solidario",
  },
  {
    header: "Sindicato",
  },
  {
    header: "Total",
    cell: ({ row }) => {
      return <>${row.original.total_bruto}</>;
    },
  },
];
