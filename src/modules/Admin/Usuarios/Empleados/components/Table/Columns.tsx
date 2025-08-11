"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";

export const createColumns = (): ColumnDef<IEmpleado>[] => [
  {
    id: "nombre_completo",
    accessorFn: (row) => {
      // Manejar el caso donde el nombre viene como "Apellido, Nombre"
      if (row.nombre && row.nombre.includes(',')) {
        return row.nombre.trim();
      }
      // Manejar el caso donde hay campos separados
      if (row.apellido) {
        return `${row.nombre} ${row.apellido}`;
      }
      // Solo nombre disponible
      return row.nombre || '';
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
      let nombreCompleto = '';
      
      // Obtener el nombre completo según el formato de datos
      if (row.original.nombre && row.original.nombre.includes(',')) {
        nombreCompleto = row.original.nombre.trim();
      } else if (row.original.apellido) {
        nombreCompleto = `${row.original.nombre} ${row.original.apellido}`;
      } else {
        nombreCompleto = row.original.nombre || '';
      }
      
      const searchValue = value.toLowerCase().trim();
      
      if (!searchValue) return true;
      
      // Normalizar el texto para búsqueda
      const textoNormalizado = nombreCompleto.toLowerCase();
      
      // Dividir el texto de búsqueda en palabras
      const palabrasBusqueda = searchValue.split(/\s+/);
      
      // Si es formato "Apellido, Nombre", también crear versión "Nombre Apellido"
      let textoAlternativo = '';
      if (nombreCompleto.includes(',')) {
        const partes = nombreCompleto.split(',').map(p => p.trim());
        if (partes.length === 2) {
          textoAlternativo = `${partes[1]} ${partes[0]}`.toLowerCase();
        }
      }
      
      // Función para verificar si todas las palabras de búsqueda están al inicio de palabras diferentes
      const verificarCoincidencia = (texto: string) => {
        const palabrasTexto = texto.split(/[\s,]+/).filter(p => p.length > 0);
        const palabrasUsadas = new Set<number>();
        
        return palabrasBusqueda.every((palabraBusqueda: string) => {
          // Buscar una palabra del texto que empiece con esta palabra de búsqueda
          // y que no haya sido usada antes
          const indiceEncontrado = palabrasTexto.findIndex((palabraTexto: string, index: number) => 
            !palabrasUsadas.has(index) && palabraTexto.startsWith(palabraBusqueda)
          );
          
          if (indiceEncontrado !== -1) {
            palabrasUsadas.add(indiceEncontrado);
            return true;
          }
          return false;
        });
      };
      
      // Verificar en el texto original y en el alternativo
      const resultadoOriginal = verificarCoincidencia(textoNormalizado);
      const resultadoAlternativo = textoAlternativo && verificarCoincidencia(textoAlternativo);
      
      return resultadoOriginal || resultadoAlternativo;
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
];
