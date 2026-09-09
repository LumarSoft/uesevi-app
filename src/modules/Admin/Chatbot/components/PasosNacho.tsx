"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, ChevronDown, Database, Loader2 } from "lucide-react";
import { IChatbotPaso } from "@/shared/types/Querys/IChatbot";

interface PasosNachoProps {
  pasos: IChatbotPaso[];
  enCurso: boolean;
  estado?: { etapa: string; texto: string } | null;
  hayTexto?: boolean;
  duracionMs?: number;
}

const formatearSegundos = (ms: number) =>
  ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1).replace(".", ",")} s`;

// Puntos suspensivos animados sin depender de fuentes: "Pensando", "Pensando.", …
const Puntos = () => {
  const [n, setN] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v + 1) % 4), 420);
    return () => clearInterval(t);
  }, []);
  return <span className="inline-block w-4 text-left">{".".repeat(n)}</span>;
};

const IconoPaso = ({ paso }: { paso: IChatbotPaso }) => {
  if (paso.estado === "en_curso")
    return <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />;
  if (paso.estado === "error") return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
  return <Check className="h-3.5 w-3.5 text-emerald-600" />;
};

/**
 * Línea de tiempo de lo que Nacho hizo para responder: la etapa actual
 * mientras trabaja —el indicador de actividad es la silueta de Nacho, al lado,
 * así que acá va sólo el texto— y debajo cada consulta a la base.
 * Al terminar se pliega en una sola línea ("Consultó 3 fuentes en 4,2 s")
 * que se puede abrir para ver el detalle: es la trazabilidad de la respuesta.
 */
const PasosNacho = ({
  pasos,
  enCurso,
  estado,
  duracionMs,
}: PasosNachoProps) => {
  const [abierto, setAbierto] = useState(false);

  if (!enCurso && !pasos.length) return null;

  const lista = (
    <ul className="mt-1.5 space-y-1 border-l border-border/60 pl-3 text-xs text-muted-foreground">
      {pasos.map((paso, indice) => (
        <li
          key={paso.id}
          className="paso-nacho flex items-start gap-2"
          style={{ animationDelay: `${Math.min(indice, 6) * 40}ms` }}
        >
          <span className="mt-0.5 shrink-0">
            <IconoPaso paso={paso} />
          </span>
          <span className="min-w-0">
            <span className={paso.estado === "en_curso" ? "text-foreground" : ""}>
              {paso.etiqueta}
            </span>
            {paso.estado === "ok" && paso.resumen && (
              <span className="opacity-80"> · {paso.resumen}</span>
            )}
            {paso.estado === "error" && (
              <span className="text-destructive"> · {paso.error || "falló"}</span>
            )}
            {paso.estado !== "en_curso" && typeof paso.ms === "number" && (
              <span className="ml-1 opacity-50">{formatearSegundos(paso.ms)}</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );

  if (enCurso) {
    return (
      <div className="mb-2" role="status" aria-live="polite">
        <div className="flex items-center gap-2.5">
          <span className="animate-pulse text-sm font-medium text-muted-foreground">
            {estado?.texto || "Pensando"}
            <Puntos />
          </span>
        </div>
        {pasos.length > 0 && lista}
      </div>
    );
  }

  const conError = pasos.some((p) => p.estado === "error");
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="flex items-center gap-1.5 rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <Database className="h-3.5 w-3.5" />
        <span>
          {pasos.length === 1 ? "Consultó 1 fuente" : `Consultó ${pasos.length} fuentes`}
          {typeof duracionMs === "number" && ` en ${formatearSegundos(duracionMs)}`}
          {conError && " · con errores"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${abierto ? "rotate-180" : ""}`}
        />
      </button>
      {abierto && lista}
    </div>
  );
};

export default PasosNacho;
