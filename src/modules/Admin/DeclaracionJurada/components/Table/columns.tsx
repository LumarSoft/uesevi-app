"use client"

import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion"
import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<IDeclaracion>[] = [
  {
    accessorKey: "nombre_empresa",
    header: "Empresa",
  },
  {
    accessorKey: "cuit_empresa",
    header: "Cuit",
  },
  
]
