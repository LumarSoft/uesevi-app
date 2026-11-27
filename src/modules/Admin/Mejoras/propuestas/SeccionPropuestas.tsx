"use client";

// Pestaña "Propuestas" de Mejoras: el personal de UESEVI propone mejoras y
// abajo quedan todas, con su estado y la respuesta del equipo de desarrollo.
// Responden sólo los emails que la API tiene en MEJORAS_RESPONSABLES
// (`puedeResponder` viene de GET /propuestas).

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { CheckCircle2, MessageSquareReply, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { postData, updateData } from "@/services/mysql/functions";
import { AREAS } from "../mejoras";
import {
  ESTADOS_PROPUESTA,
  ETIQUETA_ESTADO,
  EstadoPropuesta,
  LIMITES,
  Propuesta,
  contarPorEstado,
  erroresDePropuesta,
  fechaDePropuesta,
} from "./propuestas";

const ESTILO_ESTADO: Record<EstadoPropuesta, string> = {
  pendiente: "border-zinc-400/40 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
  en_curso: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  hecha: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  descartada: "border-zinc-400/30 bg-transparent text-muted-foreground",
};

const SIN_AREA = "sin-area";
type FiltroEstado = "todas" | EstadoPropuesta;

export default function SeccionPropuestas({
  propuestas,
  puedeResponder,
  cargando,
  error,
  onCambio,
}: {
  propuestas: Propuesta[];
  puedeResponder: boolean;
  cargando: boolean;
  error: string | null;
  /** Una propuesta nueva o actualizada: la página la pone en la lista. */
  onCambio: (propuesta: Propuesta) => void;
}) {
  const [filtro, setFiltro] = useState<FiltroEstado>("todas");
  const cuenta = useMemo(() => contarPorEstado(propuestas), [propuestas]);
  const visibles = useMemo(
    () => (filtro === "todas" ? propuestas : propuestas.filter((p) => p.estado === filtro)),
    [filtro, propuestas]
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-16">
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="space-y-2">
          <h2 className="text-2xl font-normal tracking-tight">¿Qué te gustaría que mejoremos?</h2>
          <p className="leading-7 text-muted-foreground">
            Contanos qué te facilitaría el trabajo. Lo leemos y te respondemos
            acá mismo: vas a ver si está en curso, si ya está hecho y cómo lo
            resolvimos.
          </p>
        </div>
        <FormularioPropuesta onCreada={onCambio} />
      </div>

      <section aria-labelledby="titulo-propuestas" className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="titulo-propuestas" className="text-2xl font-normal tracking-tight">
            Lo que propusieron
          </h2>
          {propuestas.length > 0 && (
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por estado">
              {(["todas", ...ESTADOS_PROPUESTA] as FiltroEstado[])
                .filter((f) => f === "todas" || cuenta[f] > 0)
                .map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFiltro(f)}
                    aria-pressed={filtro === f}
                    className={cn(
                      "rounded-full border px-3 py-1 text-sm transition-colors",
                      filtro === f
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {f === "todas" ? "Todas" : ETIQUETA_ESTADO[f]}{" "}
                    <span className="tabular-nums opacity-70">
                      {f === "todas" ? propuestas.length : cuenta[f]}
                    </span>
                  </button>
                ))}
            </div>
          )}
        </div>

        {cargando && <p className="text-muted-foreground">Cargando propuestas…</p>}
        {!cargando && error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
            No pudimos traer las propuestas: {error}
          </p>
        )}
        {!cargando && !error && propuestas.length === 0 && (
          <p className="rounded-xl border border-dashed px-5 py-8 text-center text-muted-foreground">
            Todavía no hay propuestas. ¡La primera puede ser la tuya!
          </p>
        )}

        <ol className="space-y-4">
          {visibles.map((propuesta) => (
            <TarjetaPropuesta
              key={propuesta.id}
              propuesta={propuesta}
              puedeResponder={puedeResponder}
              onRespondida={onCambio}
            />
          ))}
        </ol>
      </section>
    </div>
  );
}

function FormularioPropuesta({ onCreada }: { onCreada: (p: Propuesta) => void }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [area, setArea] = useState(SIN_AREA);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const errores = erroresDePropuesta(titulo, descripcion);
    if (errores.length) {
      setError(errores[0]);
      return;
    }
    setEnviando(true);
    setError("");
    const datos = new FormData();
    datos.append("titulo", titulo.trim());
    datos.append("descripcion", descripcion.trim());
    if (area !== SIN_AREA) datos.append("area", area);
    const resultado = await postData("propuestas", datos);
    setEnviando(false);
    if (!resultado?.ok) {
      setError(resultado?.message || "No pudimos enviar la propuesta. Probá de nuevo.");
      return;
    }
    onCreada(resultado.data);
    setTitulo("");
    setDescripcion("");
    setArea(SIN_AREA);
    toast.success("¡Gracias! Recibimos tu propuesta.");
  };

  return (
    <form
      onSubmit={enviar}
      className="space-y-4 rounded-xl border border-foreground/[0.12] bg-background p-5 shadow-sm dark:border-border sm:p-6"
      data-recorrido="propuestas-formulario"
    >
      <div className="space-y-1.5">
        <Label htmlFor="propuesta-titulo">Título</Label>
        <Input
          id="propuesta-titulo"
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value);
            setError("");
          }}
          maxLength={LIMITES.tituloMax}
          placeholder="Ej.: Exportar la lista de empresas a Excel"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="propuesta-descripcion">Contanos un poco más</Label>
        <Textarea
          id="propuesta-descripcion"
          value={descripcion}
          onChange={(e) => {
            setDescripcion(e.target.value);
            setError("");
          }}
          maxLength={LIMITES.descripcionMax}
          rows={4}
          placeholder="¿Qué te gustaría que pase? ¿En qué pantalla? Si podés, un ejemplo."
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="propuesta-area">Área (opcional)</Label>
        <Select value={area} onValueChange={setArea}>
          <SelectTrigger id="propuesta-area">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SIN_AREA}>No sé / varias</SelectItem>
            {AREAS.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={enviando} className="w-full gap-2">
        <Send className="h-4 w-4" aria-hidden />
        {enviando ? "Enviando…" : "Enviar propuesta"}
      </Button>
    </form>
  );
}

function TarjetaPropuesta({
  propuesta,
  puedeResponder,
  onRespondida,
}: {
  propuesta: Propuesta;
  puedeResponder: boolean;
  onRespondida: (p: Propuesta) => void;
}) {
  const [respondiendo, setRespondiendo] = useState(false);
  const autor = propuesta.autor?.trim() || "Alguien del equipo";

  return (
    <li className="rounded-xl border bg-background p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-medium leading-snug">{propuesta.titulo}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {autor}
            {propuesta.esMia && " (vos)"} · {fechaDePropuesta(propuesta.created)}
            {propuesta.area && ` · ${propuesta.area}`}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
            ESTILO_ESTADO[propuesta.estado]
          )}
        >
          {ETIQUETA_ESTADO[propuesta.estado] ?? propuesta.estado}
        </span>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-foreground/80">
        {propuesta.descripcion}
      </p>

      {propuesta.respuesta && (
        <div className="mt-4 rounded-lg border-l-2 border-primary bg-primary/5 px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            {propuesta.estado === "hecha" && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />}
            Respuesta del equipo de desarrollo
            {propuesta.respondida_en && ` · ${fechaDePropuesta(propuesta.respondida_en)}`}
          </p>
          <p className="mt-1 whitespace-pre-line text-sm leading-6">{propuesta.respuesta}</p>
        </div>
      )}

      {puedeResponder &&
        (respondiendo ? (
          <FormularioRespuesta
            propuesta={propuesta}
            onCancelar={() => setRespondiendo(false)}
            onGuardada={(p) => {
              onRespondida(p);
              setRespondiendo(false);
            }}
          />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 -ml-2 gap-1.5 text-muted-foreground"
            onClick={() => setRespondiendo(true)}
          >
            <MessageSquareReply className="h-4 w-4" aria-hidden />
            {propuesta.respuesta ? "Editar respuesta" : "Responder"}
          </Button>
        ))}
    </li>
  );
}

function FormularioRespuesta({
  propuesta,
  onCancelar,
  onGuardada,
}: {
  propuesta: Propuesta;
  onCancelar: () => void;
  onGuardada: (p: Propuesta) => void;
}) {
  const [estado, setEstado] = useState<EstadoPropuesta>(
    propuesta.estado === "pendiente" ? "hecha" : propuesta.estado
  );
  const [respuesta, setRespuesta] = useState(propuesta.respuesta ?? "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (estado === "descartada" && !respuesta.trim()) {
      setError("Para descartarla, contá brevemente por qué.");
      return;
    }
    setGuardando(true);
    setError("");
    const datos = new FormData();
    datos.append("estado", estado);
    datos.append("respuesta", respuesta.trim());
    const resultado = await updateData("propuestas/:id/respuesta", propuesta.id, datos);
    setGuardando(false);
    if (!resultado?.ok) {
      setError(resultado?.message || "No se pudo guardar la respuesta.");
      return;
    }
    onGuardada(resultado.data);
    toast.success("Respuesta guardada.");
  };

  return (
    <form onSubmit={guardar} className="mt-4 space-y-3 rounded-lg border bg-muted/30 p-4">
      <div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
        <div className="space-y-1.5">
          <Label htmlFor={`estado-${propuesta.id}`}>Estado</Label>
          <Select value={estado} onValueChange={(v) => setEstado(v as EstadoPropuesta)}>
            <SelectTrigger id={`estado-${propuesta.id}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS_PROPUESTA.map((e) => (
                <SelectItem key={e} value={e}>
                  {ETIQUETA_ESTADO[e]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`respuesta-${propuesta.id}`}>Comentario para el equipo</Label>
          <Textarea
            id={`respuesta-${propuesta.id}`}
            value={respuesta}
            onChange={(e) => {
              setRespuesta(e.target.value);
              setError("");
            }}
            maxLength={LIMITES.respuestaMax}
            rows={3}
            placeholder="Ej.: ¡Listo! Ya está en Panel de Pagos → Exportar."
          />
        </div>
      </div>
      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar respuesta"}
        </Button>
      </div>
    </form>
  );
}
