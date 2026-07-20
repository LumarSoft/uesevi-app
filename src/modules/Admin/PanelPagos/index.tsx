"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchData } from "@/services/mysql/functions";
import { GridRow, SummaryResponse } from "@/shared/types/PaymentsPanel";
import SummaryCards from "./components/SummaryCards";
import Filters, { EstadoFiltro } from "./components/Filters";
import PaymentsGrid from "./components/PaymentsGrid";
import GestionEmpresasModal from "./components/GestionEmpresasModal";
import { mesConVencido } from "./helpers";

const now = new Date();
// Rango por defecto: 6 meses hacia atrás desde el mes actual (dentro del año).
const DEFAULT_TO = now.getMonth() + 1;
const DEFAULT_FROM = Math.max(1, DEFAULT_TO - 5);

const MESES = Array.from({ length: 12 }, (_, i) => i + 1);

export default function PanelPagosSection() {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [estado, setEstado] = useState<EstadoFiltro>("todos");
  const [gestionOpen, setGestionOpen] = useState(false);

  const [rows, setRows] = useState<GridRow[]>([]);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchGrid = useCallback(async () => {
    setLoadingGrid(true);
    try {
      const res = await fetchData(
        `payments-panel/grid?year=${year}&from=${from}&to=${to}`
      );
      setRows(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error("Error grilla panel de pagos:", e);
      setRows([]);
    } finally {
      setLoadingGrid(false);
    }
  }, [year, from, to]);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const res = await fetchData(
        `payments-panel/summary?year=${year}&month=${month}`
      );
      setSummary(res?.data ?? null);
    } catch (e) {
      console.error("Error resumen panel de pagos:", e);
      setSummary(null);
    } finally {
      setLoadingSummary(false);
    }
  }, [year, month]);

  useEffect(() => {
    fetchGrid();
  }, [fetchGrid]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleFromChange = (m: number) => {
    setFrom(m);
    if (m > to) setTo(m);
  };
  const handleToChange = (m: number) => {
    setTo(m < from ? from : m);
  };

  // Opciones del combobox: una por empresa activa en el resultado actual.
  const empresaOptions = useMemo(
    () =>
      rows.map((r) => ({ id: r.empresa_id, nombre: r.nombre, cuit: r.cuit })),
    [rows]
  );

  // Filtro (empresa seleccionada + estado) y orden en cliente.
  const visibleRows = useMemo(() => {
    let list = [...rows];

    if (selectedEmpresaId !== null) {
      list = list.filter((r) => r.empresa_id === selectedEmpresaId);
    }

    if (estado === "aldia") {
      list = list.filter((r) => r.meses_pendientes === 0);
    } else if (estado === "pendientes") {
      list = list.filter((r) => r.meses_pendientes > 0);
    }

    list.sort((a, b) => {
      const cmp = a.nombre
        .trim()
        .localeCompare(b.nombre.trim(), "es", { sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [rows, selectedEmpresaId, estado, sortDir]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="text-xl font-bold">
            Panel de Pagos de Empresas
          </CardTitle>
          {/* Mes de resumen: arriba de todo, gobierna las tarjetas superiores. */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">
              Mes de cobranza
            </label>
            {/* Mes vencido: el mes seleccionado cobra el período del mes anterior.
                Se muestra "Julio (Junio)" y arranca en el mes en curso. */}
            <Select
              value={String(month)}
              onValueChange={(v) => setMonth(Number(v))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MESES.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {mesConVencido(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <SummaryCards
          summary={summary}
          month={month}
          year={year}
          loading={loadingSummary}
        />

        <Filters
          year={year}
          onYearChange={setYear}
          from={from}
          to={to}
          onFromChange={handleFromChange}
          onToChange={handleToChange}
          empresaOptions={empresaOptions}
          selectedEmpresaId={selectedEmpresaId}
          onSelectedEmpresaChange={setSelectedEmpresaId}
          sortDir={sortDir}
          onToggleSort={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          estado={estado}
          onEstadoChange={setEstado}
          onOpenGestion={() => setGestionOpen(true)}
        />

        <PaymentsGrid
          rows={visibleRows}
          from={from}
          to={to}
          loading={loadingGrid}
        />

        <p className="text-xs text-muted-foreground">
          Cada casillero muestra el monto (automático desde la DDJJ) y la fecha de
          pago. Click en el monto expande el desglose FAS / Ap. Solidario / Cuota
          Sindical / Intereses. El rango de meses controla cuántos se muestran a la
          vez.
        </p>
      </CardContent>

      <GestionEmpresasModal
        open={gestionOpen}
        onOpenChange={setGestionOpen}
        onChanged={fetchGrid}
      />
    </Card>
  );
}
