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
    header: "Remunerativo adicional",
  },
  {
    header: "Categoria",
  },
  {
    header: "Adicional",
  },
  {
    header: "Total bruto",
  },
  {
    header: "Aporte extraordinario",
  },
  {
    header: "FAS",
  },
  {
    header: "Aporte solidario",
  },
  {
    header: "Sindicato",
  },
  {
    header: "Total",
  },
];
