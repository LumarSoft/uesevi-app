import { Button } from "@/components/ui/button";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import Link from "next/link";

export const createColumns = (): ColumnDef<IDeclaracion>[] => [
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
    cell: ({ row }) => {
      const date = new Date(row.original.fecha);
      return date.toLocaleDateString();
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
      const isFirstRow = row.index === 0;
      return (
        <>
          {isFirstRow && (
            <Link href={`/empresa/declaraciones/${row.original.id}`}>
              <Button>
                <EyeIcon />
                Ver
              </Button>
            </Link>
          )}
        </>
      );
    },
  },
];
