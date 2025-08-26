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

  // Estado para el término de búsqueda unificado
  const [searchTerm, setSearchTerm] = React.useState("");

  // Estado para filtros activos (solo se aplican al hacer clic en Buscar)
  const [activeFilters, setActiveFilters] = React.useState({
    search: "",
  });

  // Cache para puntuaciones calculadas
  const scoreCache = React.useRef(new Map<string, number>());

  const table = useReactTable({
    data,
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

  // Función para ejecutar la búsqueda unificada
  const handleSearch = () => {
    setActiveFilters({
      search: searchTerm,
    });
    setCurrentPage(0); // Reiniciar a primera página
  };

  // Función para limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm("");
    setActiveFilters({
      search: "",
    });
    setCurrentPage(0);
  };

  // Función para normalizar texto de búsqueda (eliminar comas, normalizar espacios)
  const normalizarTexto = (texto: string): string => {
    return texto
      .toLowerCase()
      .replace(/,/g, " ") // Reemplazar comas con espacios
      .replace(/\s+/g, " ") // Múltiples espacios → un solo espacio
      .trim(); // Eliminar espacios al inicio y final
  };

  // Función optimizada para calcular puntuación de coincidencia (MEJORADA para coincidencias parciales)
  const calcularPuntuacionOptimizada = (
    combinaciones: string[],
    searchValue: string
  ) => {
    // Crear clave única para el cache
    const cacheKey = `${combinaciones.join("|")}|${searchValue}`;

    // Verificar si ya está en cache
    if (scoreCache.current.has(cacheKey)) {
      return scoreCache.current.get(cacheKey)!;
    }

    let maxPuntuacion = 0;

    // Normalizar el texto de búsqueda
    const searchValueNormalizado = normalizarTexto(searchValue);
    const palabrasBusqueda = searchValueNormalizado
      .split(/\s+/)
      .filter((p: string) => p.length > 0);

    for (const combinacion of combinaciones) {
      let puntuacion = 0;
      const combinacionNormalizada = normalizarTexto(combinacion);

      // Coincidencia exacta (máxima puntuación)
      if (combinacionNormalizada === searchValueNormalizado) {
        puntuacion += 1000;
      }

      // Coincidencia al inicio (alta puntuación)
      if (combinacionNormalizada.startsWith(searchValueNormalizado)) {
        puntuacion += 500;
      }

      // Coincidencia al final (media puntuación)
      if (combinacionNormalizada.endsWith(searchValueNormalizado)) {
        puntuacion += 300;
      }

      // NUEVA LÓGICA: Puntuación por coincidencias de palabras individuales
      let palabrasEncontradas = 0;
      let palabrasConPosicion = [];

      for (const palabra of palabrasBusqueda) {
        // Buscar la palabra exacta con regex para evitar coincidencias parciales no deseadas
        const regex = new RegExp(`\\b${palabra}\\b`, "i");
        const match = regex.exec(combinacionNormalizada);

        if (match) {
          palabrasEncontradas++;
          palabrasConPosicion.push({
            palabra,
            posicion: match.index,
            esInicio:
              match.index === 0 ||
              combinacionNormalizada[match.index - 1] === " ",
            esDespuesComa:
              match.index > 0 &&
              combinacionNormalizada[match.index - 1] === ",",
          });
        }
      }

      // Puntuación por cada palabra encontrada
      if (palabrasEncontradas > 0) {
        // Bonus base por cada palabra
        puntuacion += palabrasEncontradas * 100;

        // Bonus por posición de las palabras
        for (const palabraInfo of palabrasConPosicion) {
          if (palabraInfo.esInicio) {
            puntuacion += 80; // Palabra al inicio o después de espacio
          } else if (palabraInfo.esDespuesComa) {
            puntuacion += 60; // Palabra después de coma
          } else {
            puntuacion += 40; // Palabra en cualquier lugar
          }
        }

        // Bonus por encontrar todas las palabras
        if (palabrasEncontradas === palabrasBusqueda.length) {
          puntuacion += 300;

          // Bonus por orden correcto de palabras
          let ordenCorrecto = true;
          let ultimaPosicion = -1;

          for (const palabraInfo of palabrasConPosicion.sort(
            (a, b) => a.posicion - b.posicion
          )) {
            if (palabraInfo.posicion <= ultimaPosicion) {
              ordenCorrecto = false;
              break;
            }
            ultimaPosicion = palabraInfo.posicion;
          }

          if (ordenCorrecto) {
            puntuacion += 200;
          }
        }

        // Bonus por coincidencias parciales (cuando no se encuentran todas las palabras)
        if (
          palabrasEncontradas >= 2 &&
          palabrasEncontradas < palabrasBusqueda.length
        ) {
          puntuacion += 150;
        }
      }

      maxPuntuacion = Math.max(maxPuntuacion, puntuacion);
    }

    // Guardar en cache
    scoreCache.current.set(cacheKey, maxPuntuacion);

    // Limpiar cache si es muy grande (más de 1000 entradas)
    if (scoreCache.current.size > 1000) {
      scoreCache.current.clear();
    }

    return maxPuntuacion;
  };

  // Obtener los datos filtrados y ordenados por puntuación de búsqueda (MEJORADO para ser más inclusivo)
  const orderedRows = React.useMemo(() => {
    // Si no hay filtros activos, usar todos los datos
    if (!activeFilters.search) {
      return table.getCoreRowModel().rows;
    }

    // Solo procesar cuando hay filtros activos (después de hacer clic en Buscar)
    const filteredAndScoredRows = table.getCoreRowModel().rows.filter((row) => {
      if (!activeFilters.search || !activeFilters.search.trim()) {
        return true;
      }

      const searchValue = activeFilters.search.trim();
      const searchValueLower = searchValue.toLowerCase();
      let maxScore = 0;
      let hasMatch = false;

      // 1. Buscar en NOMBRE y APELLIDO (MEJORADO)
      const apellido = (row.original as any).apellido || "";
      const nombre = (row.original as any).nombre || "";

      // Normalizar los valores de la base de datos
      const apellidoNormalizado = normalizarTexto(apellido);
      const nombreNormalizado = normalizarTexto(nombre);
      const searchValueNormalizado = normalizarTexto(searchValue);

      // Crear diferentes combinaciones para búsqueda (con y sin comas)
      const combinaciones = [
        `${apellido} ${nombre}`, // "Apellido Nombre"
        `${nombre} ${apellido}`, // "Nombre Apellido"
        `${apellido}, ${nombre}`, // "Apellido, Nombre"
        `${nombre}, ${apellido}`, // "Nombre, Apellido"
        apellido, // Solo apellido
        nombre, // Solo nombre
      ];

      // NUEVA LÓGICA: Buscar coincidencias parciales en cada palabra
      const palabrasBusqueda = searchValueNormalizado
        .split(/\s+/)
        .filter((p) => p.length > 0);
      let coincidenciasParciales = 0;
      let todasLasPalabrasEncontradas = true;

      // Verificar si cada palabra de búsqueda está presente en alguna combinación
      for (const palabra of palabrasBusqueda) {
        let palabraEncontrada = false;

        for (const combinacion of combinaciones) {
          const combinacionNormalizada = normalizarTexto(combinacion);

          // Buscar la palabra exacta (no solo includes)
          const regex = new RegExp(`\\b${palabra}\\b`, "i");
          if (regex.test(combinacionNormalizada)) {
            palabraEncontrada = true;
            coincidenciasParciales++;
            break;
          }
        }

        if (!palabraEncontrada) {
          todasLasPalabrasEncontradas = false;
        }
      }

      // Si se encontraron al menos 2 palabras o todas las palabras, considerar como match
      if (coincidenciasParciales >= 2 || todasLasPalabrasEncontradas) {
        hasMatch = true;
        const puntuacion = calcularPuntuacionOptimizada(
          combinaciones,
          searchValue
        );
        maxScore = Math.max(maxScore, puntuacion);

        // Bonus por coincidencias parciales
        if (coincidenciasParciales >= 2) {
          maxScore += coincidenciasParciales * 50;
        }
      }

      // 2. Buscar en CUIL
      const cuil = String((row.original as any).cuil || "");
      if (cuil.includes(searchValue)) {
        hasMatch = true;
        // Puntuación alta para coincidencias de CUIL
        maxScore = Math.max(maxScore, 800);
      }

      // 3. Buscar en EMPRESA
      const empresa = (row.original as any).nombre_empresa || "";
      if (empresa.toLowerCase().includes(searchValueLower)) {
        hasMatch = true;
        // Puntuación media para coincidencias de empresa
        maxScore = Math.max(maxScore, 600);
      }

      // Asignar la puntuación al row
      if (hasMatch) {
        (row.original as any).searchScore = maxScore;
      }

      return hasMatch;
    });

    // Ordenar por puntuación de búsqueda
    const sortedRows = filteredAndScoredRows.sort((rowA, rowB) => {
      const scoreA = (rowA.original as any).searchScore || 0;
      const scoreB = (rowB.original as any).searchScore || 0;

      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Orden descendente (mayor puntuación primero)
      }

      // Si las puntuaciones son iguales, ordenar alfabéticamente
      const nombreA = `${(rowA.original as any).apellido || ""} ${
        (rowA.original as any).nombre || ""
      }`.toLowerCase();
      const nombreB = `${(rowB.original as any).apellido || ""} ${
        (rowB.original as any).nombre || ""
      }`.toLowerCase();

      return nombreA.localeCompare(nombreB);
    });

    // Debug: mostrar las primeras filas con sus puntuaciones
    if (sortedRows.length > 0) {
      console.log("=== DEBUG: Filas ordenadas por puntuación ===");
      sortedRows.slice(0, 5).forEach((row, index) => {
        const nombre = `${(row.original as any).apellido || ""} ${
          (row.original as any).nombre || ""
        }`;
        const score = (row.original as any).searchScore || 0;
        console.log(`${index + 1}. ${nombre} - Puntuación: ${score}`);
      });
      console.log("==========================================");
    }

    return sortedRows;
  }, [activeFilters.search, table.getCoreRowModel().rows]); // Solo se recalcula cuando cambian estos valores

  // Estado para paginación personalizada
  const [currentPage, setCurrentPage] = React.useState(0);
  const rowsPerPage = 10; // Mismo valor que la tabla original

  // Estado para mostrar indicador de carga
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Obtener filas para la página actual
  const getCurrentPageRows = () => {
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return orderedRows.slice(startIndex, endIndex);
  };

  // Calcular total de páginas
  const totalPages = Math.ceil(orderedRows.length / rowsPerPage);

  // Reiniciar paginación cuando cambien los filtros personalizados
  React.useEffect(() => {
    setCurrentPage(0);
  }, [activeFilters]);

  // Indicador de procesamiento cuando cambian los filtros
  React.useEffect(() => {
    if (activeFilters.search) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        setIsProcessing(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeFilters]);

  // Indicador de rendimiento para debug
  React.useEffect(() => {
    if (activeFilters.search) {
      console.log("🚀 Búsqueda procesada:", activeFilters.search);
      console.log("📊 Resultados encontrados:", orderedRows.length);
    }
  }, [activeFilters.search, orderedRows.length]);

  const onChangeFilterCombobox = (currentValue: string) => {
    table.getColumn("nombre_empresa")?.setFilterValue(currentValue);
  };

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
        />
        <Button
          onClick={handleSearch}
          disabled={!searchTerm.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          🔍 Buscar
        </Button>
        {searchTerm && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearSearch}
            className="ml-2"
          >
            ✕ Limpiar
          </Button>
        )}
        {/* Botón de debug temporal */}
      </div>

      {/* Mensaje informativo sobre las búsquedas */}
      {activeFilters.search ? (
        <div className="text-sm mb-3 p-4 bg-blue-500/10 dark:bg-blue-400/10 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <span className="text-lg">🔍</span>
            <strong>Búsqueda activa:</strong>
            <span className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-800 dark:text-blue-200">
              "{activeFilters.search}"
            </span>
            <span className="text-blue-600 dark:text-blue-400">
              ({orderedRows.length} resultados encontrados)
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
      ) : searchTerm ? (
        <div className="text-sm mb-3 p-4 bg-amber-500/10 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-700 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <span className="text-lg">✏️</span>
            <strong>Escribiendo...</strong> Haz clic en "Buscar" o presiona
            Enter para ejecutar la búsqueda
          </div>
        </div>
      ) : (
        <div className="text-sm mb-3 p-4 bg-slate-500/10 dark:bg-slate-400/10 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="text-lg">💡</span>
            <strong>Tip:</strong> Busca por nombre, CUIL o empresa. Haz clic en
            "Buscar" o presiona Enter
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
            {getCurrentPageRows()?.length ? (
              getCurrentPageRows().map((row) => (
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
                  Sin resultados..
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {orderedRows.length} de {table.getCoreRowModel().rows.length}{" "}
          empleados
          {orderedRows.length !== table.getCoreRowModel().rows.length && (
            <span className="ml-2 text-blue-600">(filtrados)</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
