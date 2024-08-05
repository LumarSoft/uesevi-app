"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IEscalas } from "@/shared/types/IEscalas";
import { EditEscalaDialog } from "@/modules/Admin/Escalas/Dialog/EditEscalaDialog";

export const createColumns = (
  onDataUpdate: (updatedItem: IEscalas) => void
): ColumnDef<IEscalas>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID:
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.original.id) return row.original.id;
      else return "Fecha no encontrada";
    },
  },

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
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Creado el
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.original.created)
        return new Date(row.original.created).toLocaleDateString();
      else return "Fecha no encontrada";
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
          Creado el
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.original.created)
        return new Date(row.original.created).toLocaleDateString();
      else return "Fecha no encontrada";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <EditEscalaDialog data={row.original} onDataUpdate={onDataUpdate} />
          <Button variant="destructive">
            {" "}
            <Trash2 className="h-5 w-5 mr-2" /> Eliminar{" "}
          </Button>
        </div>
      );
    },
  },
];
