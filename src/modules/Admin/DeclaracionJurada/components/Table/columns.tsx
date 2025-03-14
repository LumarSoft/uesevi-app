"use client";

import { Button } from "@/components/ui/button";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, FileStack } from "lucide-react";
import { StateDialog } from "../Dialog/StateDialog";
import InteresesDialog from "../Dialog/InteresesDialog";
import Link from "next/link";
import { ChangeExpiration } from "../Dialog/ChangeExpirationDialog";
import { DeleteDialog } from "../Dialog/DeleteDialog";

export const createColumns = (
  changeState: (updateItem: IDeclaracion) => void,
  deleteStatement: (id: number) => void
): ColumnDef<IDeclaracion>[] => [
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
    cell: ({ row }) => new Date(row.original.fecha).toLocaleDateString(),
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.original.estado;
      if (estado === 0) return <span className="text-red-500">Pendiente</span>;
      if (estado === 1) return <span className="text-green-500">Aprobado</span>;
      if (estado === 2)
        return <span className="text-yellow-500">Pago parcial</span>;
      if (estado === 3) return <span className="text-blue-500">Rechazado</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-3">
          <StateDialog statement={row.original} changeState={changeState} />
          <ChangeExpiration statement={row.original} />
          <InteresesDialog declaracion={row.original} />
          <Link
            href={`/admin/declaraciones/${row.original.empresa_id}/${row.original.id}`}
          >
            <Button>
              <Eye />
            </Button>
          </Link>
          {row.original.rectificada !== 0 && (
            <Link
              href={`/admin/declaraciones/historial/${row.original.empresa_id}/${row.original.year}/${row.original.mes}`}
            >
              <Button>
                <FileStack />
              </Button>
            </Link>
          )}
          <DeleteDialog statement={row.original} deleteStatement={deleteStatement}/>
        </div>
      );
    },
  },
];
