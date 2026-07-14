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
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar propuesta desde la DDJJ vigente.
  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    fetchData(`payments-panel/proposal/${idCompany}/${year}/${month}`)
      .then((res) => {
        const p: ProposalResponse = res?.data;
        setProposal(p ?? null);
        setFas(p ? String(p.fas) : "");
        setSolidario(p ? String(p.solidario) : "");
        setSindical(p ? String(p.sindical) : "");
        setIntereses("");
        setFechaPago("");
        setObservaciones("");
      })
      .catch((e) => setError(e?.message || "Error al cargar la propuesta"))
      .finally(() => setLoading(false));
  }, [open, idCompany, year, month]);

  // Al cargar la fecha de pago, autocalcular intereses.
  useEffect(() => {
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
  }, [fechaPago, proposal?.declaracion_jurada_id]);

  const total =
    (Number(fas) || 0) +
    (Number(solidario) || 0) +
    (Number(sindical) || 0) +
    (Number(intereses) || 0);

  const sinDdjj = proposal?.estado === "Sin DDJJ" || !proposal?.declaracion_jurada_id;

  const handleSave = async (confirmar: boolean) => {
    if (!proposal?.declaracion_jurada_id) return;
    setSaving(true);
    setError(null);
    try {
      const usuarioId = userStore.getState().user?.id ?? "";
      const fd = new FormData();
      fd.append("declaracion_jurada_id", String(proposal.declaracion_jurada_id));
      fd.append("fecha_pago", fechaPago);
      fd.append("importe_fas", fas);
      fd.append("importe_solidario", solidario);
      fd.append("importe_sindical", sindical);
      if (intereses !== "") fd.append("importe_intereses", intereses);
      if (observaciones) fd.append("observaciones", observaciones);
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
            Confirmar pago — {mesLargo(month)} {year}
          </DialogTitle>
          <DialogDescription>
            {proposal?.declaracion_jurada_id
              ? `Propuesto automáticamente desde DDJJ #${proposal.declaracion_jurada_id}`
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
              <Label>Intereses (auto por fecha)</Label>
              <Input
                type="number"
                value={intereses}
                onChange={(e) => setIntereses(e.target.value)}
                className="border-amber-400 focus-visible:ring-amber-400"
              />
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
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => handleSave(false)}
            >
              Guardar ajuste
            </Button>
            <Button disabled={saving || !fechaPago} onClick={() => handleSave(true)}>
              {saving ? "Guardando…" : "Confirmar pago"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
