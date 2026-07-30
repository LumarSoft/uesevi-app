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

// fechaCarga = `declaraciones_juradas.fecha`, o sea CUÁNDO SE CARGÓ la
// declaración. Es lo que determina qué fórmula del aporte solidario aplica.
// NO usar el período (mes/year) para eso: una DDJJ de un período viejo cargada
// hoy se guarda con la fórmula vigente. Ver shared/utils/aportes.ts.
export const createColumns = (
  basicSalary: any,
  fechaCarga: string | null
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
    header: "Presentismo",
    cell: ({ row }) => {
      // Congelado al cargar la declaración. $0 en las anteriores a agosto 2026.
      return (
        <React.Fragment>
          {formatCurrency(Number(row.original.presentismo) || 0)}
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
      // Fórmula vigente al momento de CARGARSE la declaración.
      const aporteSolidario = calcularAporteSolidarioPorPeriodo({
        esAfiliado: row.original.afiliado !== "No",
        fechaCarga,
        sueldoBasicoCategoria: row.original.sueldo_basico,
        presentismoCategoria: row.original.presentismo,
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

      // Fórmula vigente al momento de CARGARSE la declaración.
      const aporteSolidario = calcularAporteSolidarioPorPeriodo({
        esAfiliado: row.original.afiliado !== "No",
        fechaCarga,
        sueldoBasicoCategoria: row.original.sueldo_basico,
        presentismoCategoria: row.original.presentismo,
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
