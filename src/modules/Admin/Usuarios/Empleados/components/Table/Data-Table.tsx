"use client";

import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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

import { Input } from "@/components/ui/input";
import { ComboboxEmpresas } from "./Combobox";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";

// Tipos para la respuesta de la API de búsqueda
interface SearchResponse {
  employees: any[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  search: {
    term: string;
    companyId: number | null;
    resultsCount: number;
  };
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  empresas: IEmpresa[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  empresas,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Estados para la búsqueda
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [searchPagination, setSearchPagination] = React.useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const table = useReactTable({
    data: isSearchMode ? searchResults : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Función para realizar búsqueda en la API
  const performSearch = async (term: string, page: number = 1) => {
    if (!term.trim() || term.trim().length < 2) {
      return;
    }

    setIsSearching(true);
    try {
      const limit = 10; // Mismo que la paginación original
      const offset = (page - 1) * limit;
      const BASE_API_URL =
        process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3010";

      const response = await fetch(
        `${BASE_API_URL}/employees/search?q=${encodeURIComponent(
          term.trim()
        )}&limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.ok && result.data) {
        setSearchResults(result.data.employees);
        setSearchPagination({
          total: result.data.pagination.total,
          currentPage: result.data.pagination.currentPage,
          totalPages: result.data.pagination.totalPages,
          hasNext: result.data.pagination.hasNext,
          hasPrev: result.data.pagination.hasPrev,
        });
        setIsSearchMode(true);

        console.log(
          `✅ Búsqueda completada: ${result.data.pagination.total} resultados para "${term}"`
        );
      } else {
        console.error("❌ Error en la respuesta de búsqueda:", result.message);
        setSearchResults([]);
        setIsSearchMode(false);
      }
    } catch (error) {
      console.error("❌ Error al realizar búsqueda:", error);
      setSearchResults([]);
      setIsSearchMode(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Función para ejecutar la búsqueda
  const handleSearch = () => {
    if (searchTerm.trim()) {
      performSearch(searchTerm.trim(), 1);
    }
  };

  // Función para limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearchMode(false);
    setSearchPagination({
      total: 0,
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  };

  // Funciones para manejar paginación de búsqueda
  const handleSearchPageChange = (newPage: number) => {
    if (isSearchMode && searchTerm.trim()) {
      performSearch(searchTerm.trim(), newPage);
    }
  };

  // Obtener datos para mostrar (búsqueda o datos originales)
  const displayData = isSearchMode ? searchResults : data;
  const totalCount = isSearchMode ? searchPagination.total : data.length;

  return (
    <div>
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Buscar por nombre, CUIL o empresa..."
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          className="max-w-md"
          disabled={isSearching}
        />
        <Button
          onClick={handleSearch}
          disabled={!searchTerm.trim() || isSearching}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSearching ? "Buscando..." : "Buscar"}
        </Button>
        {(searchTerm || isSearchMode) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearSearch}
            className="ml-2"
            disabled={isSearching}
          >
            ✕ Limpiar
          </Button>
        )}
      </div>

      {/* Mensaje informativo sobre las búsquedas */}
      {isSearchMode ? (
        <div className="text-sm mb-3 p-4 bg-blue-500/10 dark:bg-blue-400/10 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span className="text-lg">🔍</span>
            <strong>Búsqueda activa:</strong>
            <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-800 dark:text-blue-200">
              &quot;{searchTerm}&quot;
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              ({searchPagination.total} resultados encontrados)
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="mt-2 h-7 px-3 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            ✕ Limpiar búsqueda
          </Button>
        </div>
      ) : isSearching ? (
        <div className="text-sm mb-3 p-4 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-700 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <span className="text-lg">⏳</span>
            <strong>Buscando...</strong> Por favor espera
          </div>
        </div>
      ) : (
        <div className="text-sm mb-3 p-4 bg-slate-500/10 dark:bg-slate-400/10 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="text-lg">💡</span>
            <strong>Tip:</strong> Busca por nombre, CUIL o empresa. Haz clic en
            &quot;Buscar&quot; para ejecutar la búsqueda
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isSearching ? "Buscando..." : "Sin resultados..."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {isSearchMode ? (
            <>
              {searchResults.length} de {searchPagination.total} empleados
              encontrados
              <span className="ml-2 text-blue-600">(búsqueda activa)</span>
            </>
          ) : (
            <>
              {table.getRowModel().rows.length} de {data.length} empleados
            </>
          )}
        </div>

        {isSearchMode ? (
          // Paginación para búsqueda
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Página {searchPagination.currentPage} de{" "}
              {searchPagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleSearchPageChange(searchPagination.currentPage - 1)
              }
              disabled={!searchPagination.hasPrev || isSearching}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleSearchPageChange(searchPagination.currentPage + 1)
              }
              disabled={!searchPagination.hasNext || isSearching}
            >
              Siguiente
            </Button>
          </div>
        ) : (
          // Paginación normal de la tabla
          <div className="flex items-center space-x-2">
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
        )}
      </div>
    </div>
  );
}
