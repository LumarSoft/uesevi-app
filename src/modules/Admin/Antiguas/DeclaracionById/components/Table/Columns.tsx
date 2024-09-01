"use client";

import { Empleado } from "@/shared/types/Querys/IOldInfoDeclaracion";
import { ColumnDef } from "@tanstack/react-table";

// Función para formatear números
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

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
    accessorKey: "monto",
    cell: ({ row }) => formatCurrency(Number(row.original.monto)),
  },
  {
    header: "Categoria",
    accessorKey: "categoria",
  },
  {
    header: "Sueldo S/ categoria",
    accessorKey: "sueldo_basico_categoria",
    cell: ({ row }) => formatCurrency(Number(row.original.sueldo_basico_categoria)),
  },
  {
    header: "Adicional",
    accessorKey: "adicional",
    cell: ({ row }) => formatCurrency(Number(row.original.adicional)),
  },
  {
    header: "Total bruto",
    accessorKey: "total_bruto",
    cell: ({ row }) => formatCurrency(Number(row.original.total_bruto)),
  },
  {
    header: "FAS 1%",
    cell: ({ row }) => {
      const fas = row.original.total_bruto * 0.01;
      return <>{formatCurrency(fas)}</>;
    },
  },
  {
    header: "Aporte solidario 2%",
    cell: ({ row }) => {
      const aporteSolidario = row.original.afiliado === "No" 
        ? row.original.total_bruto * 0.02
        : 0;
      return <>{formatCurrency(aporteSolidario)}</>;
    },
  },
  {
    header: "Sindicato",
    cell: ({ row }) => {
      const sindicato = row.original.afiliado === "Sí" 
        ? row.original.total_bruto * 0.03
        : 0;
      return <>{formatCurrency(sindicato)}</>;
    },
  },
  {
    header: "Total",
    cell: ({ row }) => {
      const fas = row.original.total_bruto * 0.01;
      const aporteSolidario = row.original.afiliado === "No" 
        ? row.original.total_bruto * 0.02
        : 0;
      const sindicato = row.original.afiliado === "Sí" 
        ? row.original.total_bruto * 0.03
        : 0;

      const total = fas + aporteSolidario + sindicato;
      return <>{formatCurrency(total)}</>;
    },
  },
];