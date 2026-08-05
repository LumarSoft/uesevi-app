"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchData } from "@/services/mysql/functions";
import { CompanyDetailResponse } from "@/shared/types/PaymentsPanel";
import { ChevronLeft } from "lucide-react";
import {
  formatCurrency,
  formatFecha,
  mesLargo,
  AÑOS_DISPONIBLES,
} from "../helpers";
import ConfirmarPago from "./ConfirmarPago";

const estadoBadge = (estado: string) => {
  if (estado === "Pagado")
    return <Badge className="bg-emerald-500 hover:bg-emerald-600">Pagado</Badge>;
  if (estado === "Pendiente")
    return <Badge variant="destructive">Pendiente</Badge>;
  return <Badge variant="secondary">Sin DDJJ</Badge>;
};

const ResumenCard = ({ label, value }: { label: string; value: string }) => (
  <Card>
    <CardContent className="pt-6">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </CardContent>
  </Card>
);

export default function PanelPagosDetalle({ idEmpresa }: { idEmpresa: string }) {
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());
  const [detail, setDetail] = useState<CompanyDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmMonth, setConfirmMonth] = useState<number | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchData(
        `payments-panel/company/${idEmpresa}?year=${year}`
      );
      setDetail(res?.data ?? null);
    } catch (e) {
      console.error("Error detalle empresa:", e);
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [idEmpresa, year]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const header = detail?.header;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/panel-pagos")}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Volver al panel
        </Button>
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
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

      <div>
        <h2 className="text-2xl font-bold">{header?.nombre ?? "Empresa"}</h2>
        <p className="text-sm text-muted-foreground">CUIT {header?.cuit ?? "—"}</p>
      </div>

      {/* Resumen anual */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <ResumenCard
          label={`Total pagado ${year}`}
          value={formatCurrency(header?.total_pagado_anio)}
        />
        <ResumenCard label="Total FAS" value={formatCurrency(header?.totales.fas)} />
        <ResumenCard
          label="Total Ap. Solidario"
          value={formatCurrency(header?.totales.solidario)}
        />
        <ResumenCard
          label="Total Cuota Sindical"
          value={formatCurrency(header?.totales.sindical)}
        />
        <ResumenCard
          label="Total Intereses"
          value={formatCurrency(header?.totales.intereses)}
        />
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Meses pendientes
            </p>
            <p className="mt-1 text-xl font-bold">
              {header && header.meses_pendientes === 0
                ? "Al día"
                : `+${header?.meses_pendientes ?? 0}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Historial */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-semibold">Historial de pagos</h3>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold">Mes</TableHead>
                  <TableHead className="text-right font-bold">Importe total</TableHead>
                  <TableHead className="text-right font-bold">FAS</TableHead>
                  <TableHead className="text-right font-bold">Ap. Solidario</TableHead>
                  <TableHead className="text-right font-bold">Cuota Sind.</TableHead>
                  <TableHead className="text-right font-bold">Intereses</TableHead>
                  <TableHead className="font-bold">Fecha pago</TableHead>
                  <TableHead className="font-bold">Estado</TableHead>
                  <TableHead className="font-bold">Origen</TableHead>
                  <TableHead className="font-bold"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      Cargando…
                    </TableCell>
                  </TableRow>
                ) : detail && detail.historial.length > 0 ? (
                  detail.historial.map((row) => (
                    // La key incluye la DDJJ: si por datos sucios llegara más
                    // de una fila del mismo mes, React no las colapsa ni las
                    // renderiza desordenadas (el backend ya garantiza una sola).
                    <TableRow key={`${row.mes}-${row.declaracion_jurada_id}`}>
                      <TableCell className="font-medium">
                        {mesLargo(row.mes)} {year}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(row.importe_total)}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(row.fas)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(row.solidario)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(row.sindical)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(row.intereses)}
                        {!row.aplica_interes && (
                          <span
                            className="ml-1 text-xs text-muted-foreground"
                            title="Este período no recalcula interés por mora"
                          >
                            (sin interés)
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{formatFecha(row.fecha_pago)}</TableCell>
                      <TableCell>{estadoBadge(row.estado)}</TableCell>
                      <TableCell>
                        {row.declaracion_jurada_id ? (
                          <button
                            type="button"
                            className="text-indigo-600 underline-offset-2 hover:underline"
                            onClick={() =>
                              router.push(
                                `/admin/declaraciones/${idEmpresa}/${row.declaracion_jurada_id}`
                              )
                            }
                          >
                            DDJJ #{row.declaracion_jurada_id}
                          </button>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {row.declaracion_jurada_id && (
                          // También en las Pagado: hay que poder corregir una
                          // fecha mal cargada sin desconfirmar el pago.
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setConfirmMonth(row.mes)}
                          >
                            {row.estado === "Pagado" ? "Editar" : "Confirmar"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                      Sin declaraciones juradas para este año.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            La fecha de pago se puede editar en cualquier momento, incluso en las
            declaraciones ya confirmadas (editarlas no las desconfirma). El
            interés se calcula automáticamente por fecha de pago y admite ajuste
            manual; con la opción &ldquo;Calcular interés por mora&rdquo;
            destildada, cambiar la fecha no modifica el importe — es lo indicado
            para completar declaraciones viejas que ya se cobraron.
          </p>
        </CardContent>
      </Card>

      {confirmMonth !== null && (
        <ConfirmarPago
          open={confirmMonth !== null}
          onOpenChange={(v) => !v && setConfirmMonth(null)}
          idCompany={Number(idEmpresa)}
          year={year}
          month={confirmMonth}
          onSaved={fetchDetail}
        />
      )}
    </div>
  );
}
