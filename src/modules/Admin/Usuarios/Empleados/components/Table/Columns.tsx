"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { HistorialDialog } from "../Dialog/HistorialDialog";

export const createColumns = (): ColumnDef<IEmpleado>[] => [
  {
    id: "nombre_completo",
    accessorFn: (row) => {
      // Crear nombre completo en formato "Apellido, Nombre"
      if (row.apellido && row.nombre) {
        return `${row.apellido}, ${row.nombre}`;
      }
      // Fallback si solo hay nombre
      return row.nombre || row.apellido || '';
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre y Apellido
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value.trim() === '') return true;
      
      const searchValue = value.toLowerCase().trim();
      const apellido = (row.original.apellido || '').toLowerCase();
      const nombre = (row.original.nombre || '').toLowerCase();
      
      // Crear diferentes combinaciones para búsqueda
      const combinaciones = [
        `${apellido} ${nombre}`,           // "Apellido Nombre"
        `${nombre} ${apellido}`,           // "Nombre Apellido"
        `${apellido}, ${nombre}`,          // "Apellido, Nombre"
        `${nombre}, ${apellido}`,          // "Nombre, Apellido"
        apellido,                          // Solo apellido
        nombre,                            // Solo nombre
      ];
      
      // Dividir el texto de búsqueda en palabras
      const palabrasBusqueda = searchValue.split(/\s+/).filter((p: string) => p.length > 0);
      
      // Función para calcular puntuación de coincidencia
      const calcularPuntuacion = (texto: string) => {
        let puntuacion = 0;
        const textoLower = texto.toLowerCase();
        
        // Coincidencia exacta (máxima puntuación)
        if (textoLower === searchValue) {
          puntuacion += 1000;
        }
        
        // Coincidencia al inicio (alta puntuación)
        if (textoLower.startsWith(searchValue)) {
          puntuacion += 500;
        }
        
        // Coincidencia al final (media puntuación)
        if (textoLower.endsWith(searchValue)) {
          puntuacion += 300;
        }
        
        // Verificar si todas las palabras de búsqueda están presentes
        let todasLasPalabras = true;
        let palabrasEncontradas = 0;
        
        for (const palabra of palabrasBusqueda) {
          if (textoLower.includes(palabra)) {
            palabrasEncontradas++;
            // Puntuación adicional por cada palabra encontrada
            if (textoLower.startsWith(palabra)) {
              puntuacion += 100; // Palabra al inicio
            } else if (textoLower.includes(` ${palabra}`)) {
              puntuacion += 80;  // Palabra después de espacio
            } else {
              puntuacion += 50;  // Palabra en cualquier lugar
            }
          } else {
            todasLasPalabras = false;
          }
        }
        
        // Bonus por encontrar todas las palabras
        if (todasLasPalabras) {
          puntuacion += 200;
        }
        
        // Bonus por orden correcto de palabras
        if (palabrasEncontradas === palabrasBusqueda.length) {
          let ordenCorrecto = true;
          let ultimaPosicion = -1;
          
          for (const palabra of palabrasBusqueda) {
            const posicion = textoLower.indexOf(palabra);
            if (posicion <= ultimaPosicion) {
              ordenCorrecto = false;
              break;
            }
            ultimaPosicion = posicion;
          }
          
          if (ordenCorrecto) {
            puntuacion += 150;
          }
        }
        
        return puntuacion;
      };
      
      // Calcular puntuación para cada combinación
      const puntuaciones = combinaciones.map((combinacion: string) => ({
        texto: combinacion,
        puntuacion: calcularPuntuacion(combinacion)
      }));
      
      // Obtener la máxima puntuación
      const maxPuntuacion = Math.max(...puntuaciones.map((p: { puntuacion: number }) => p.puntuacion));
      
      // Guardar la puntuación en el row para ordenamiento posterior
      (row as any).searchScore = maxPuntuacion;
      
      // Retornar true si hay alguna coincidencia (puntuación > 0)
      return maxPuntuacion > 0;
    },
    sortingFn: (rowA, rowB) => {
      // Ordenar por puntuación de búsqueda (descendente) si está disponible
      const scoreA = (rowA.original as any).searchScore || 0;
      const scoreB = (rowB.original as any).searchScore || 0;
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Orden descendente (mayor puntuación primero)
      }
      
      // Si las puntuaciones son iguales, ordenar alfabéticamente
      const nombreA = `${rowA.original.apellido || ''} ${rowA.original.nombre || ''}`.toLowerCase();
      const nombreB = `${rowB.original.apellido || ''} ${rowB.original.nombre || ''}`.toLowerCase();
      
      return nombreA.localeCompare(nombreB);
    },
  },
  {
    accessorKey: "cuil",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cuil
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    filterFn: (row, id, value) => {
      if (!value || value.trim() === '') return true;
      
      const searchValue = value.trim();
      const cuil = String(row.original.cuil || '');
      
      // Coincidencia exacta
      if (cuil === searchValue) return true;
      
      // Coincidencia parcial (contiene el valor de búsqueda)
      if (cuil.includes(searchValue)) return true;
      
      return false;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          E-mail
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "created",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de alta
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "nombre_empresa",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Empresa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "sindicato_activo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Afiliado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <span>{row.original.sindicato_activo ? "Si" : "No"}</span>;
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <HistorialDialog empleado={row.original} />
        </div>
      );
    },
  },
];
