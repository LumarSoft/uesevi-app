"use client";

import React from "react";
import { Empleado } from "@/shared/types/Querys/IInfoDeclaracion";
import { ColumnDef } from "@tanstack/react-table";
import { calcularAporteSolidarioPorPeriodo } from "@/shared/utils/aportes";

// Función para formatear números como moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

// mes/year son el PERÍODO de la declaración: se usan para elegir la fórmula
// correcta del aporte solidario (versionada, ver shared/utils/aportes.ts).
export const createColumns = (
  basicSalary: any,
  mes: number,
  year: number
): ColumnDef<Empleado>[] => [
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
    header: "Categoria",
    accessorKey: "categoria",
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
    header: "Aporte extraordinario",
    cell: () => {
      return <React.Fragment>$ {0}</React.Fragment>;
    },
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
            Number(row.original.monto) +
              Number(row.original.adicional) +
              Number(row.original.suma_no_remunerativa) +
              Number(row.original.remunerativo_adicional)
          )}
        </React.Fragment>
      );
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
      // Fórmula versionada por período (nueva desde julio 2026, vieja antes).
      const aporteSolidario = calcularAporteSolidarioPorPeriodo({
        esAfiliado: row.original.afiliado !== "No",
        mes,
        year,
        sueldoBasicoCategoria: row.original.sueldo_basico,
        monto: row.original.monto,
        sumaNoRemunerativa: row.original.suma_no_remunerativa,
        remunerativoAdicional: row.original.remunerativo_adicional,
      });
      return <React.Fragment>{formatCurrency(aporteSolidario)}</React.Fragment>;
    },
  },
  {
    header: "Sindicato",
    cell: ({ row }) => {
      // 3% del (sueldo básico + adicionales) solo para afiliados
      const sindicato =
        row.original.afiliado === "Sí"
          ? (Number(row.original.monto) +
              Number(row.original.adicional) +
              Number(row.original.suma_no_remunerativa) +
              Number(row.original.remunerativo_adicional)) *
            0.03
          : 0;
      return <React.Fragment>{formatCurrency(sindicato)}</React.Fragment>;
    },
  },
  {
    header: "Total",
    cell: ({ row }) => {
      // 1% del basicSalary
      const fas = basicSalary * 0.01;

      // Fórmula versionada por período (nueva desde julio 2026, vieja antes).
      const aporteSolidario = calcularAporteSolidarioPorPeriodo({
        esAfiliado: row.original.afiliado !== "No",
        mes,
        year,
        sueldoBasicoCategoria: row.original.sueldo_basico,
        monto: row.original.monto,
        sumaNoRemunerativa: row.original.suma_no_remunerativa,
        remunerativoAdicional: row.original.remunerativo_adicional,
      });

      // 3% del (sueldo básico + adicionales) solo para afiliados
      const sindicato =
        row.original.afiliado === "Sí"
          ? (Number(row.original.monto) +
              Number(row.original.adicional) +
              Number(row.original.suma_no_remunerativa) +
              Number(row.original.remunerativo_adicional)) *
            0.03
          : 0;

      const total = fas + aporteSolidario + sindicato;
      return <React.Fragment>{formatCurrency(total)}</React.Fragment>;
    },
  },
];
