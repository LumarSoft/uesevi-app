"use client";

import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { ColumnDef } from "@tanstack/react-table";

export const createColumns = (): ColumnDef<IDeclaracion>[] => [
  {
    header: "Nombre",
  },
  {
    header: "Afiliado",
  },
  {
    header: "CUIL",
  },
  {
    header: "Sueldo basico",
  },
  {
    header: "Categoria",
  },
  {
    header: "Sueldo S/ categoria",
  },
  {
    header: "Adicional",
  },
  {
    header: "Total bruto",
  },
  {
    header: "FAS 1%",
  },
  {
    header: "Aporte solidario 2%",
  },
  {
    header: "Sindicato",
  },
  {
    header: "Total",
  },
];
