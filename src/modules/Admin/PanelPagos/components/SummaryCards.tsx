"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SummaryResponse } from "@/shared/types/PaymentsPanel";
import { formatCurrency, mesLargo } from "../helpers";
import { Wallet, TrendingUp, AlertCircle } from "lucide-react";

interface Props {
  summary: SummaryResponse | null;
  month: number;
  year: number;
  loading?: boolean;
}

const DesgloseLinea = ({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{formatCurrency(value)}</span>
  </div>
);

export default function SummaryCards({ summary, month, year, loading }: Props) {
  const cobrado = summary?.cobrado_mes;
  const acumulado = summary?.acumulado_anio;
  const pendientes = summary?.empresas_pendientes;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Cobrado del mes (se reinicia) */}
      <Card className="border-l-4 border-l-sky-500">
        <CardContent className="pt-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <Wallet className="h-4 w-4 text-sky-500" />
            Cobrado del mes — {mesLargo(month)} {year} (se reinicia)
          </div>
          <p className="mb-3 text-2xl font-bold">
            {loading ? "…" : formatCurrency(cobrado?.total)}
          </p>
          <div className="space-y-1">
            <DesgloseLinea label="FAS" value={cobrado?.fas ?? 0} />
            <DesgloseLinea label="Ap. Solidario" value={cobrado?.solidario ?? 0} />
            <DesgloseLinea label="Cuota Sindical" value={cobrado?.sindical ?? 0} />
          </div>
        </CardContent>
      </Card>

      {/* Acumulado del año (fijo) */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardContent className="pt-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Acumulado {year} (fijo)
          </div>
          <p className="mb-3 text-2xl font-bold">
            {loading ? "…" : formatCurrency(acumulado?.total)}
          </p>
          <div className="space-y-1">
            <DesgloseLinea label="FAS" value={acumulado?.fas ?? 0} />
            <DesgloseLinea label="Ap. Solidario" value={acumulado?.solidario ?? 0} />
            <DesgloseLinea label="Cuota Sindical" value={acumulado?.sindical ?? 0} />
          </div>
        </CardContent>
      </Card>

      {/* Empresas pendientes */}
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-6">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Empresas pendientes — {mesLargo(month)} {year}
          </div>
          <p className="mb-3 text-3xl font-bold">
            {loading
              ? "…"
              : `${pendientes?.pendientes ?? 0} de ${pendientes?.total ?? 0}`}
          </p>
          <p className="text-xs text-muted-foreground">
            Indicador simple. El detalle de cuáles se ve al entrar a cada empresa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
