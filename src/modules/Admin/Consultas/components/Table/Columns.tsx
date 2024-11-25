"use client";

import { IInquiry } from "@/shared/types/Querys/IInquiry";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<IInquiry>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "mensaje",
    header: "Mensaje",
  },
  {
    accessorKey: "created",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.original.created);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
];
