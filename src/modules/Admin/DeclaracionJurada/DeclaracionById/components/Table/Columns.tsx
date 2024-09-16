"use client";

import { Empleado } from "@/shared/types/Querys/IInfoDeclaracion";
import { ColumnDef } from "@tanstack/react-table";

// Función para formatear números como moneda
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
    cell: ({ row }) => {
      return <>{formatCurrency(Number(row.original.sueldo_basico))}</>;
    },
  },
  {
    header: "Remunerativo adicional",
    cell: ({ row }) => {
      return <>{formatCurrency(Number(row.original.remunerativo_adicional))}</>;
    },
  },
  {
    header: "Suma no remunerativa",
    cell: ({ row }) => {
      return <>{formatCurrency(Number(row.original.suma_no_remunerativa))}</>;
    },
  },
  {
    header: "Categoria",
    accessorKey: "categoria",
  },
  {
    header: "Adicional",
    cell: ({ row }) => {
      return <>{formatCurrency(Number(row.original.adicional))}</>;
    },
  },
  {
    header: "Total bruto",
    cell: ({ row }) => {
      return <>{formatCurrency(Number(row.original.total_bruto))}</>;
    },
  },
  {
    header: "Aporte extraordinario",
    cell: ({ row }) => {
      return <>{0}</>;
    },
    // ??
  },
  {
    header: "FAS",
    cell: ({ row }) => {
      const fas = row.original.total_bruto * 0.01;
      return <>{formatCurrency(fas)}</>;
    },
  },
  {
    header: "Aporte solidario",
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
      //aporte extraordinario?
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
