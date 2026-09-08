"use client";

import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postData } from "@/services/mysql/functions";
import { IChatbotPropuesta } from "@/shared/types/Querys/IChatbot";
import { toast } from "react-toastify";

type Estado = "pendiente" | "aplicada" | "descartada";

const formatearValor = (valor: string | number | null) => {
  if (valor === null || valor === undefined || valor === "") return "(vacío)";
  return String(valor);
};

/**
 * El chatbot nunca escribe en la base: deja una propuesta y esta tarjeta es el
 * único camino para aplicarla. Muestra valor actual → valor nuevo campo por
 * campo para que el admin vea exactamente qué se va a tocar antes de confirmar.
 */
const PropuestaCard = ({ propuesta }: { propuesta: IChatbotPropuesta }) => {
  const [estado, setEstado] = useState<Estado>("pendiente");
  const [enviando, setEnviando] = useState(false);

  const campos = Object.keys(propuesta.valores_nuevos);

  const confirmar = async () => {
    setEnviando(true);
    const formData = new FormData();
    formData.append("id_propuesta", propuesta.id);

    const resultado = await postData("chatbot/confirm", formData);
    setEnviando(false);

    if (resultado.ok) {
      setEstado("aplicada");
      toast.success("Cambio aplicado");
    } else {
      toast.error(resultado.message || "No se pudo aplicar el cambio");
    }
  };

  const descartar = async () => {
    setEnviando(true);
    const formData = new FormData();
    formData.append("id_propuesta", propuesta.id);

    await postData("chatbot/discard", formData);
    setEnviando(false);
    setEstado("descartada");
  };

  return (
    <div className="mt-3 rounded-2xl border border-amber-500/30 bg-amber-500/[0.06] p-4">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <div className="min-w-0 flex-1">
          <p className="text-sm">{propuesta.resumen}</p>

          <ul className="mt-2.5 space-y-1">
            {campos.map((campo) => (
              <li key={campo} className="flex flex-wrap items-baseline gap-1.5 text-xs">
                <span className="font-mono text-muted-foreground">{campo}:</span>
                <span className="line-through opacity-60">
                  {formatearValor(propuesta.valores_actuales?.[campo] ?? null)}
                </span>
                <span aria-hidden>→</span>
                <span className="font-semibold">
                  {formatearValor(propuesta.valores_nuevos[campo])}
                </span>
              </li>
            ))}
          </ul>

          {estado === "pendiente" && (
            <div className="mt-3.5 flex gap-2">
              <Button size="sm" className="h-8 rounded-full px-4" onClick={confirmar} disabled={enviando}>
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Confirmar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 rounded-full px-4"
                onClick={descartar}
                disabled={enviando}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Descartar
              </Button>
            </div>
          )}

          {estado === "aplicada" && (
            <p className="mt-3.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
              <Check className="h-3.5 w-3.5" />
              Cambio aplicado
            </p>
          )}

          {estado === "descartada" && (
            <p className="mt-3.5 text-xs text-muted-foreground">Propuesta descartada</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropuestaCard;
