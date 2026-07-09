"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, Building2 } from "lucide-react";
import { AÑOS_DISPONIBLES, mesLargo } from "../helpers";
import EmpresaCombobox, { EmpresaOption } from "./EmpresaCombobox";

export type EstadoFiltro = "todos" | "aldia" | "pendientes";

interface Props {
  year: number;
  onYearChange: (y: number) => void;
  from: number;
  to: number;
  onFromChange: (m: number) => void;
  onToChange: (m: number) => void;
  /** Lista de empresas disponibles para el combobox */
  empresaOptions: EmpresaOption[];
  /** ID de empresa seleccionada en el combobox; null = todas */
  selectedEmpresaId: number | null;
  onSelectedEmpresaChange: (id: number | null) => void;
  sortDir: "asc" | "desc";
  onToggleSort: () => void;
  estado: EstadoFiltro;
  onEstadoChange: (e: EstadoFiltro) => void;
  onOpenGestion: () => void;
}

const MESES = Array.from({ length: 12 }, (_, i) => i + 1);

export default function Filters(props: Props) {
  return (
    <div className="space-y-4">
      {/* Fila 1: año, rango custom (mes inicio / mes fin), gestión */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Año</label>
          <Select
            value={String(props.year)}
            onValueChange={(v) => props.onYearChange(Number(v))}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AÑOS_DISPONIBLES.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Mes de inicio</label>
          <Select
            value={String(props.from)}
            onValueChange={(v) => props.onFromChange(Number(v))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {mesLargo(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Mes de fin</label>
          <Select
            value={String(props.to)}
            onValueChange={(v) => props.onToChange(Number(v))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((m) => (
                <SelectItem key={m} value={String(m)} disabled={m < props.from}>
                  {mesLargo(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={props.onOpenGestion}
          className="ml-auto flex items-center gap-2"
        >
          <Building2 className="h-4 w-4" />
          Gestionar empresas
        </Button>
      </div>

      {/* Fila 2: combobox empresa, orden, filtro estado */}
      <div className="flex flex-wrap items-center gap-3">
        <EmpresaCombobox
          options={props.empresaOptions}
          value={props.selectedEmpresaId}
          onChange={props.onSelectedEmpresaChange}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={props.onToggleSort}
          className="flex items-center gap-1"
        >
          Ordenar {props.sortDir === "asc" ? "A-Z" : "Z-A"}
          <ArrowUpDown className="h-4 w-4" />
        </Button>

        <Select
          value={props.estado}
          onValueChange={(v) => props.onEstadoChange(v as EstadoFiltro)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="aldia">Al día</SelectItem>
            <SelectItem value="pendientes">Pendientes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
