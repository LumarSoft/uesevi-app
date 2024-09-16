"use client";

import { Button } from "@/components/ui/button";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { IOldDeclaracion } from "@/shared/types/Querys/IOldDeclaracion";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";

export const createColumns = (): ColumnDef<
  IOldDeclaracion | IDeclaracion
>[] => [
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
      if ("old_empresa_id" in row.original) {
        const originalRow = row.original as IOldDeclaracion;
        return (
          <div className="flex gap-3">
            <Button>
              <Link
                href={`/admin/antiguas/${originalRow.old_empresa_id}/${originalRow.id}`}
              >
                <Eye />
              </Link>
            </Button>
          </div>
        );
      }
    },
  },
];
