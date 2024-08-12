import { Button } from "@/components/ui/button";
import { INoticias } from "@/shared/types/Querys/INoticias";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Delete } from "../AlertDialogs/Delete";
import Link from "next/link";

export const createColumns = (
  onDataDelete: (deleteItem: INoticias) => void
): ColumnDef<INoticias>[] => [
  {
    accessorKey: "titulo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titulo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "cuerpo",
    header: "Cuerpo",
    cell: ({ row }) => {
      return (
        <p className="line-clamp-1 lowercase w-1/2">{row.original.cuerpo}</p>
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
          Creado
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
          <Link href={`/admin/noticias/edit-noticia/${row.original.id}`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          <Delete data={row.original} onDataDelete={onDataDelete} />
        </div>
      );
    },
  },
];
