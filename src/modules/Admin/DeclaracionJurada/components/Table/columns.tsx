"use client";

import { Button } from "@/components/ui/button";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { StateDialog } from "../Dialog/StateDialog";

export const createColumns = (
  changeState: (updateItem: IDeclaracion) => void
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
          <StateDialog declaracion={row.original} changeState={changeState}/>
          <Button>
            <Eye />
          </Button>
          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chart-no-axes-combined"
            >
              <path d="M12 16v5" />
              <path d="M16 14v7" />
              <path d="M20 10v11" />
              <path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" />
              <path d="M4 18v3" />
              <path d="M8 14v7" />
            </svg>
          </Button>
        </div>
      );
    },
  },
];
