"use client";

import React from "react";
import { Empleado } from "@/shared/types/Querys/IInfoDeclaracion";
import { ColumnDef } from "@tanstack/react-table";

// Función para formatear números como moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

export const createColumns = (basicSalary: any): ColumnDef<Empleado>[] => [
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
    header: "Sueldo básico de la categoría",
    cell: ({ row }) => {
      return (
        <React.Fragment>
          {formatCurrency(Number(row.original.sueldo_basico))}
        </React.Fragment>
      );
    },
  },
  {
    header: "Remunerativo adicional",
    cell: ({ row }) => {
      return (
        <React.Fragment>
          {formatCurrency(Number(row.original.remunerativo_adicional))}
        </React.Fragment>
      );
    },
  },
  {
    header: "Suma no remunerativa",
    cell: ({ row }) => {
      return (
        <React.Fragment>
          {formatCurrency(Number(row.original.suma_no_remunerativa))}
        </React.Fragment>
      );
    },
  },
  {
    header: "Categoria",
    accessorKey: "categoria",
  },
  {
    header: "Sueldo básico del empleado",
    cell: ({ row }) => {
      return (
        <React.Fragment>
          {formatCurrency(Number(row.original.monto))}
        </React.Fragment>
      );
    },
  },
  {
    header: "Adicional",
    cell: ({ row }) => {
      return (
        <React.Fragment>
          {formatCurrency(Number(row.original.adicional))}
        </React.Fragment>
      );
    },
  },
  {
    header: "Total bruto",
    cell: ({ row }) => {
      return (
        <React.Fragment>
          {formatCurrency(
            row.original.sueldo_basico + Number(row.original.adicional)
          )}
        </React.Fragment>
      );
    },
  },
  {
    header: "Aporte extraordinario",
    cell: () => {
      return <React.Fragment>{0}</React.Fragment>;
    },
  },
  {
    header: "FAS",
    cell: ({ row }) => {
      // 1% del basicSalary
      const fas = basicSalary * 0.01;
      return <React.Fragment>{formatCurrency(fas)}</React.Fragment>;
    },
  },
  {
    header: "Aporte solidario",
    cell: ({ row }) => {
      // 2% del sueldo básico solo para no afiliados
      const aporteSolidario =
        row.original.afiliado === "No" ? Number(row.original.monto) * 0.02 : 0;
      return <React.Fragment>{formatCurrency(aporteSolidario)}</React.Fragment>;
    },
  },
  {
    header: "Sindicato",
    cell: ({ row }) => {
      // 3% del (sueldo básico + adicionales) solo para afiliados
      const sindicato =
        row.original.afiliado === "Sí"
          ? (row.original.sueldo_basico + Number(row.original.adicional)) * 0.03
          : 0;
      return <React.Fragment>{formatCurrency(sindicato)}</React.Fragment>;
    },
  },
  {
    header: "Total",
    cell: ({ row }) => {
      // 1% del basicSalary
      const fas = basicSalary * 0.01;

      // 2% del sueldo básico solo para no afiliados
      const aporteSolidario =
        row.original.afiliado === "No" ? Number(row.original.monto) * 0.02 : 0;

      // 3% del (sueldo básico + adicionales) solo para afiliados
      const sindicato =
        row.original.afiliado === "Sí"
          ? (Number(row.original.monto) + Number(row.original.adicional)) * 0.03
          : 0;

      const total = fas + aporteSolidario + sindicato;
      return <React.Fragment>{formatCurrency(total)}</React.Fragment>;
    },
  },
];
