"use client";

import { Button } from "@/components/ui/button";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, FileStack, Pen } from "lucide-react";
import Link from "next/link";
import { PayDate } from "../Dialogs/PayDate";

export const createColumns = (rates: string): ColumnDef<IDeclaracion>[] => [
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
    accessorKey: "vencimiento",
    header: "Fecha de vencimiento",
    cell: ({ row }) => {
      const date = row.original.vencimiento;
      return new Date(date).toLocaleDateString();
    },
  },

  {
    accessorKey: "rectificada",
    header: "Número de rectificación",
    cell: ({ row }) => {
      const rectificada = row.original.rectificada;
      if (rectificada === 0) {
        return <span className="text-green-500">ORIGINAL</span>;
      } else {
        return <span>{rectificada}</span>;
      }
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
          {/* <PayDate data={row.original} rates={rates} /> Sacamos la opcion de que las empresas puedan modificar la fecha de pago */}
          <Link href={`/empresa/declaraciones/${row.original.id}`}>
            <Button>
              <Eye />
            </Button>
          </Link>
          <Link href={`/empresa/declaraciones/${row.original.id}/rectificar`}>
            <Button>
              <Pen />
            </Button>
          </Link>
          {row.original.rectificada !== 0 && (
            <Link
              href={`/empresa/declaraciones/historial/${row.original.year}/${row.original.mes}`}
            >
              <Button>
                <FileStack />
              </Button>
            </Link>
          )}
        </div>
      );
    },
  },
];
