import { Button } from "@/components/ui/button";
import { ICategoria } from "@/shared/types/Querys/ICategory";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DeleteCategoria } from "../Dialog/DeleteCategoria";
import { EditCategory } from "../Dialog/EditCategoria";
import { ProgramCategory } from "../Dialog/ProgramCategory";

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
    accessorKey: "presentismo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Presentismo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // Sin cargar => el aporte solidario se calcula solo sobre el básico.
      return (
        <p>
          {row.original.presentismo
            ? `$ ${row.original.presentismo}`
            : "No definido"}
        </p>
      );
    },
  },
  {
    id: "aporte_solidario",
    header: "Aporte solidario (2%)",
    cell: ({ row }) => {
      // Base = sueldo básico + presentismo, ambos de la categoría.
      const base =
        (Number(row.original.sueldo_basico) || 0) +
        (Number(row.original.presentismo) || 0);
      return (
        <p className="font-medium">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(base * 0.02)}
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
    accessorKey: "fecha_vigencia",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vigencia del sueldo futuro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p>
          {row.original.fecha_vigencia
            ? row.original.fecha_vigencia
            : "No definido"}
        </p>
      );
    },
  },
  {
    accessorKey: "presentismo_futuro",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Presentismo Futuro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p>
          {row.original.presentismo_futuro
            ? row.original.presentismo_futuro
            : "No definido"}
        </p>
      );
    },
  },
  {
    accessorKey: "fecha_vigencia_presentismo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vigencia del presentismo futuro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <p>
          {row.original.fecha_vigencia_presentismo
            ? row.original.fecha_vigencia_presentismo
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
          <ProgramCategory data={row.original} onDataUpdate={onDataUpdate} />
          <EditCategory data={row.original} onDateUpdate={onDataUpdate} />
          <DeleteCategoria data={row.original} onDataDelete={onDataDelete} />
        </div>
      );
    },
  },
];
