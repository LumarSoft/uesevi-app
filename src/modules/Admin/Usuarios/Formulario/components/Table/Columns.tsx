"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ToggleEmpresa } from "../AlertDialogs/ToggleEmpresa";
import { Button } from "@/components/ui/button";
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { DialogComponent } from "../Dialog/Dialog";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";

export const createColumns = (
  onDataUpdate: (updatedItem: IFormulario) => void,
  companies: IEmpresa[]
): ColumnDef<IFormulario>[] => [
  {
    accessorKey: "nombre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.nombre} {row.original.apellido}
        </div>
      );
    },
  },
  {
    accessorKey: "cuil",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cuil
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Alta
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "empresa",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Empresa de registro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <DialogComponent data={row.original} />
          <ToggleEmpresa
            data={row.original}
            companies={companies}
            onDataUpdate={onDataUpdate}
          />
          <Button>Imprimir</Button>
        </div>
      );
    },
  },
];
