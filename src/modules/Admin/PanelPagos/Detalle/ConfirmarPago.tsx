"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { fetchData, postData, updateData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import {
  ProposalResponse,
  InterestPreview,
} from "@/shared/types/PaymentsPanel";
import { formatCurrency, mesLargo } from "../helpers";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  idCompany: number;
  year: number;
  month: number;
  onSaved: () => void;
}

export default function ConfirmarPago({
  open,
  onOpenChange,
  idCompany,
  year,
  month,
  onSaved,
}: Props) {
  const [proposal, setProposal] = useState<ProposalResponse | null>(null);
  const [fas, setFas] = useState("");
  const [solidario, setSolidario] = useState("");
  const [sindical, setSindical] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [intereses, setIntereses] = useState("");
  const [aplicaInteres, setAplicaInteres] = useState(true);
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Evita que el auto-cálculo pise los valores recién traídos del backend
  // apenas se abre el diálogo (el effect de fechaPago dispararía de inmediato).
  const [hidratado, setHidratado] = useState(false);

  // Normaliza la fecha que llega del backend (ISO / datetime) al formato que
  // espera <input type="date">. Sin esto el input queda vacío y se pierde.
  const aInputDate = (v: string | null | undefined) =>
    v ? String(v).slice(0, 10) : "";

  // Cargar el estado actual del período: propuesta desde la DDJJ vigente MÁS lo
  // que ya se haya guardado en el panel (fecha, intereses, observaciones), para
  // poder CORREGIR en vez de reescribir desde cero.
  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    setHidratado(false);
    fetchData(`payments-panel/proposal/${idCompany}/${year}/${month}`)
      .then((res) => {
        const p: ProposalResponse = res?.data;
        setProposal(p ?? null);
        setFas(p ? String(p.fas) : "");
        setSolidario(p ? String(p.solidario) : "");
        setSindical(p ? String(p.sindical) : "");
        setIntereses(p && p.intereses ? String(p.intereses) : "");
        setFechaPago(aInputDate(p?.fecha_pago));
        setObservaciones(p?.observaciones ?? "");
        // Default: las pendientes (a completar) calculan interés; las ya
        // pagadas no, para no modificarles el importe que ya cobraron.
        setAplicaInteres(p ? p.aplica_interes : true);
      })
      .catch((e) => setError(e?.message || "Error al cargar la propuesta"))
      .finally(() => {
        setLoading(false);
        setHidratado(true);
      });
  }, [open, idCompany, year, month]);

  // Checkbox destildado => la declaración no lleva interés: el importe se pone
  // en 0 y el campo queda bloqueado. Es lo que hace falta para completar
  // declaraciones viejas ya cobradas sin inflarles el importe.
  useEffect(() => {
    if (!hidratado) return;
    if (!aplicaInteres) setIntereses("0");
  }, [aplicaInteres, hidratado]);

  // Al cambiar la fecha de pago, recalcular intereses — sólo si corresponde.
  // Con el checkbox destildado no se llama al preview y el importe queda en 0.
  useEffect(() => {
    if (!hidratado) return;
    if (!aplicaInteres) return;
    if (!fechaPago || !proposal?.declaracion_jurada_id) return;
    const fd = new FormData();
    fd.append("declaracion_jurada_id", String(proposal.declaracion_jurada_id));
    fd.append("fecha_pago", fechaPago);
    postData("payments-panel/interest/preview", fd)
      .then((res) => {
        const data: InterestPreview = res?.data;
        if (data) setIntereses(String(data.interes));
      })
      .catch((e) => console.error("Error preview interés:", e));
  }, [fechaPago, aplicaInteres, hidratado, proposal?.declaracion_jurada_id]);

  const total =
    (Number(fas) || 0) +
    (Number(solidario) || 0) +
    (Number(sindical) || 0) +
    (Number(intereses) || 0);

  const sinDdjj = proposal?.estado === "Sin DDJJ" || !proposal?.declaracion_jurada_id;
  // Ya confirmado: el diálogo pasa a modo edición (se puede corregir la fecha
  // sin desconfirmar el pago).
  const yaPagado = proposal?.estado === "Pagado";

  const handleSave = async (confirmar: boolean) => {
    if (!proposal?.declaracion_jurada_id) return;
    setSaving(true);
    setError(null);
    try {
      const usuarioId = userStore.getState().user?.id ?? "";
      const fd = new FormData();
      fd.append("declaracion_jurada_id", String(proposal.declaracion_jurada_id));
      fd.append("fecha_pago", fechaPago);
      fd.append("aplica_interes", aplicaInteres ? "1" : "0");
      fd.append("importe_fas", fas);
      fd.append("importe_solidario", solidario);
      fd.append("importe_sindical", sindical);
      if (intereses !== "") fd.append("importe_intereses", intereses);
      fd.append("observaciones", observaciones);
      if (usuarioId !== "") fd.append("usuario_carga", String(usuarioId));

      // PUT /payments-panel/payment (endpoint sin :id; updateData deja la URL intacta).
      const res = await updateData("payments-panel/payment", 0 as any, fd);
      if (res && res.ok === false) {
        throw new Error(res.message || "Error al guardar el pago");
      }

      if (confirmar) {
        const ppId = res?.data?.id;
        if (ppId) {
          await postData(`payments-panel/payment/${ppId}/confirm`, new FormData());
        }
      }
      onSaved();
      onOpenChange(false);
    } catch (e: any) {
      setError(e?.message || "Error al guardar el pago");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {yaPagado ? "Editar pago" : "Confirmar pago"} — {mesLargo(month)}{" "}
            {year}
          </DialogTitle>
          <DialogDescription>
            {proposal?.declaracion_jurada_id
              ? yaPagado
                ? `Pago ya confirmado (DDJJ #${proposal.declaracion_jurada_id}). Los cambios no lo desconfirman.`
                : `Propuesto automáticamente desde DDJJ #${proposal.declaracion_jurada_id}`
              : "Sin DDJJ presentada para el período."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="py-6 text-center text-muted-foreground">Cargando…</p>
        ) : sinDdjj ? (
          <p className="py-6 text-center text-muted-foreground">
            No hay una declaración jurada presentada para este mes, por lo que no
            se puede proponer un importe automáticamente.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label>Importe FAS</Label>
              <Input
                type="number"
                value={fas}
                onChange={(e) => setFas(e.target.value)}
              />
            </div>
            <div>
              <Label>Importe Ap. Solidario</Label>
              <Input
                type="number"
                value={solidario}
                onChange={(e) => setSolidario(e.target.value)}
              />
            </div>
            <div>
              <Label>Importe Cuota Sindical</Label>
              <Input
                type="number"
                value={sindical}
                onChange={(e) => setSindical(e.target.value)}
              />
            </div>
            <div>
              <Label>Fecha de pago real</Label>
              <Input
                type="date"
                value={fechaPago}
                onChange={(e) => setFechaPago(e.target.value)}
              />
            </div>
            <div>
              <Label>
                Intereses {aplicaInteres ? "(auto por fecha)" : "(no aplica)"}
              </Label>
              <Input
                type="number"
                value={intereses}
                disabled={!aplicaInteres}
                onChange={(e) => setIntereses(e.target.value)}
                className={
                  aplicaInteres
                    ? "border-amber-400 focus-visible:ring-amber-400"
                    : ""
                }
              />
            </div>
            <div className="sm:col-span-3">
              <div className="flex items-start gap-2 rounded-md border p-3">
                <Checkbox
                  id="aplica-interes"
                  checked={aplicaInteres}
                  onCheckedChange={(v) => setAplicaInteres(v === true)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="aplica-interes"
                    className="cursor-pointer font-medium"
                  >
                    Calcular interés por mora
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {aplicaInteres
                      ? "El interés se recalcula automáticamente al cambiar la fecha de pago."
                      : "Esta declaración no lleva interés: el importe queda en $0 y cambiar la fecha no lo modifica. Usalo para completar declaraciones viejas que ya se cobraron."}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label>Total (incluye intereses)</Label>
              <Input value={formatCurrency(total)} readOnly className="font-semibold" />
            </div>
            <div className="sm:col-span-3">
              <Label>Observaciones</Label>
              <Textarea
                placeholder="opcional (por ejemplo, motivo del ajuste manual)"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {!sinDdjj && !loading && (
          <DialogFooter className="gap-2">
            {yaPagado ? (
              // Ya está confirmado: sólo se guardan las correcciones.
              <Button disabled={saving} onClick={() => handleSave(false)}>
                {saving ? "Guardando…" : "Guardar cambios"}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  disabled={saving}
                  onClick={() => handleSave(false)}
                >
                  Guardar ajuste
                </Button>
                <Button
                  disabled={saving || !fechaPago}
                  onClick={() => handleSave(true)}
                >
                  {saving ? "Guardando…" : "Confirmar pago"}
                </Button>
              </>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
