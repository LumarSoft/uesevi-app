"use client";

import { Button } from "@/components/ui/button";
import { IOldDeclaracion } from "@/shared/types/Querys/IOldDeclaracion";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { StateDialog } from "../Dialog/StateDialog";
import InteresesDialog from "../Dialog/InteresesDialog";
import Link from "next/link";

export const createColumns = (
  changeState: (updateItem: IOldDeclaracion) => void
): ColumnDef<IOldDeclaracion>[] => [
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
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-3">
          <Button>
            <Link href={`/admin/antiguas/${row.original.id}`}>
              <Eye />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
