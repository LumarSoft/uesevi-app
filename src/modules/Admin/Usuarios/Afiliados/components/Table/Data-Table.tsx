"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IAfiliado } from "@/shared/types/Querys/IAfiliado";

const FILAS_POR_PAGINA = [25, 50, 100];

interface DataTableProps {
  columns: ColumnDef<IAfiliado>[];
  /** Afiliados ya filtrados por el buscador, en el orden en que hay que mostrarlos. */
  data: IAfiliado[];
  /** Qué mostrar cuando `data` viene vacío. */
  vacio: React.ReactNode;
}

export function DataTable({ columns, data, vacio }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getRowId: (afiliado) => String(afiliado.empleado_id),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: FILAS_POR_PAGINA[0] } },
    // Al cambiar la búsqueda (cambia `data`) o el orden, la tabla vuelve sola a
    // la primera página: es el comportamiento por defecto de TanStack Table.
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const total = data.length;
  const desde = total === 0 ? 0 : pageIndex * pageSize + 1;
  const hasta = Math.min((pageIndex + 1) * pageSize, total);
  const paginas = Math.max(table.getPageCount(), 1);

  return (
    <div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  {vacio}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {total === 0
            ? "Sin resultados"
            : `Mostrando ${desde.toLocaleString("es-AR")}–${hasta.toLocaleString(
                "es-AR"
              )} de ${total.toLocaleString("es-AR")}`}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Filas por página</span>
            <Select
              value={String(pageSize)}
              onValueChange={(valor) => table.setPageSize(Number(valor))}
            >
              <SelectTrigger
                className="h-9 w-[76px]"
                aria-label="Filas por página"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILAS_POR_PAGINA.map((cantidad) => (
                  <SelectItem key={cantidad} value={String(cantidad)}>
                    {cantidad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Página {pageIndex + 1} de {paginas}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
