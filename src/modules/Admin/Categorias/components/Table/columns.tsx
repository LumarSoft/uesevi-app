import { Button } from "@/components/ui/button";
import { ICategoria } from "@/shared/types/Querys/ICategorias";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DeleteCategoria } from "../Dialog/DeleteCategoria";
import EditCategoria from "../Dialog/EditCategoria";

export const createColumns = (
  onDataDelete: (deleteItem: ICategoria) => void,
  onDataUpdate: (updateItem: ICategoria) => void
): ColumnDef<ICategoria>[] => [
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
    accessorKey: "sueldo_basico",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sueldo Basico
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p>
          {row.original.sueldo_basico
            ? `$ ${row.original.sueldo_basico}`
            : "No definido"}
        </p>
      );
    },
  },

  {
    accessorKey: "sueldo_futuro",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sueldo Futuro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p>
          {row.original.sueldo_futuro
            ? row.original.sueldo_futuro
            : "No definido"}
        </p>
      );
    },
  },

  {
    accessorKey: "modified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ultima modificacion
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-4">
          <EditCategoria data={row.original} />
          <DeleteCategoria data={row.original} />
        </div>
      );
    },
  },
];
