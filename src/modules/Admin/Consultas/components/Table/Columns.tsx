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
];
