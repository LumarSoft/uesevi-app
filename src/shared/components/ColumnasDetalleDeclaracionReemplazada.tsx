import { ColumnDef } from "@tanstack/react-table";
import { Empleado } from "@/shared/types/Querys/IInfoDeclaracion";

const moneda = (valor: string | number | null) =>
  valor === null || valor === undefined
    ? "Sin dato"
    : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(valor));

export const columnasDetalleDeclaracionReemplazada: ColumnDef<Empleado>[] = [
  { accessorKey: "nombre_completo", header: "Nombre" },
  { accessorKey: "cuil", header: "CUIL" },
  { accessorKey: "afiliado", header: "Afiliado al declarar" },
  { accessorKey: "categoria", header: "Categoría" },
  { id: "monto", header: "Sueldo declarado", cell: ({ row }) => moneda(row.original.monto) },
  { id: "adicional", header: "Adicional", cell: ({ row }) => moneda(row.original.adicional) },
  { id: "remunerativo_adicional", header: "Remunerativo adicional", cell: ({ row }) => moneda(row.original.remunerativo_adicional) },
  { id: "suma_no_remunerativa", header: "Suma no remunerativa", cell: ({ row }) => moneda(row.original.suma_no_remunerativa) },
  { id: "sueldo_basico", header: "Básico de categoría al declarar", cell: ({ row }) => moneda(row.original.sueldo_basico) },
  { id: "presentismo", header: "Presentismo al declarar", cell: ({ row }) => moneda(row.original.presentismo) },
];
