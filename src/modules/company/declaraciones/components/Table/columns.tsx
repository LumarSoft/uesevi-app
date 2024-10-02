"use client";

import { Button } from "@/components/ui/button";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, FileStack, Pen } from "lucide-react";
import Link from "next/link";
import { PayDate } from "../Dialogs/PayDate";

export const createColumns = (): ColumnDef<IDeclaracion>[] => [
  {
    accessorKey: "fecha",
    header: "Fecha de presentación",
    cell: ({ row }) => {
      const date = row.original.fecha;
      return new Date(date).toLocaleDateString();
    },
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
    accessorKey: "importe",
    header: "Importe",
  },

  {
    accessorKey: "fecha_pago",
    header: "Fecha de pago",
    cell: ({ row }) => {
      const date = row.original.fecha_pago;
      return date ? new Date(date).toLocaleDateString() : "Sin pagar";
    },
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
          <PayDate data={row.original} />
          <Button>
            <Link href={`/empresa/declaraciones/${row.original.id}`}>
              <Eye />
            </Link>
          </Button>
          <Button>
            <Link href={`/empresa/declaraciones/${row.original.id}/rectificar`}>
              <Pen />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
