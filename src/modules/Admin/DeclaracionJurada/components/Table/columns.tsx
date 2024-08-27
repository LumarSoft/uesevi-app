"use client";

import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { ColumnDef } from "@tanstack/react-table";

export const createColumns = (): ColumnDef<IDeclaracion>[] => [
  {
    accessorKey: "nombre_empresa",
    header: "Empresa",
  },
  {
    accessorKey: "cuit_empresa",
    header: "Cuit",
  },
  {
    accessorKey: "mes",
    header: "Mes",
  },
  {
    accessorKey: "year",
    header: "Año",
  },
  {
    accessorKey: "fecha",
    header: "Fecha de presentación",
  },
  {
    accessorKey: "estado",
    header: "Estado",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <></>;
    },
  },
];
