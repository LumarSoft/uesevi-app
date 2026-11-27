"use client";

// Página "Mejoras" del panel: un changelog. Cada cambio es una fila con dos
// columnas — a la izquierda título, fecha y tipo sobre una línea de tiempo; a
// la derecha "Qué cambia" y, si hay, "Dónde verlo". Los datos viven en
// ./mejoras.ts.

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Copy,
  ListFilter,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  AREAS,
  AreaMejora,
  MEJORAS,
  Mejora,
  TIPOS,
  TipoMejora,
  fechaCorta,
  mesYAnio,
  textoParaCompartir,
} from "./mejoras";

const ESTILO_TIPO: Record<TipoMejora, { icono: LucideIcon; etiqueta: string }> = {
  Nuevo: {
    icono: Sparkles,
    etiqueta:
      "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  Mejora: {
    icono: TrendingUp,
    etiqueta: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  },
  Corrección: {
    icono: Wrench,
    etiqueta:
      "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  Seguridad: {
    icono: ShieldCheck,
    etiqueta:
      "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-400",
  },
};

type FiltroArea = "todas" | AreaMejora;
type FiltroTipo = "todos" | TipoMejora;

/** Copia al portapapeles; si el navegador no deja, prueba el método viejo. */
const copiarAlPortapapeles = async (texto: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = texto;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
};

export default function MejorasModule() {
  const [area, setArea] = useState<FiltroArea>("todas");
  const [tipo, setTipo] = useState<FiltroTipo>("todos");

  const visibles = useMemo(
    () =>
      MEJORAS.filter(
        (m) =>
          (area === "todas" || m.area === area) &&
          (tipo === "todos" || m.tipo === tipo)
      ),
    [area, tipo]
  );

  const ultimaFecha = MEJORAS[0]?.fecha;
  const desde = MEJORAS[MEJORAS.length - 1]?.fecha;
  const filtrosActivos = (area !== "todas" ? 1 : 0) + (tipo !== "todos" ? 1 : 0);
  const limpiarFiltros = () => {
    setArea("todas");
    setTipo("todos");
  };

  const copiar = async (lista: Mejora[]) => {
    const ok = await copiarAlPortapapeles(textoParaCompartir(lista));
    if (ok) toast.success("Copiado: ya lo podés pegar en WhatsApp o en un mail.");
    else toast.error("No se pudo copiar. Probá de nuevo.");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 lg:py-14">
      <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
            Mejoras
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Novedades y arreglos del sistema de UESEVI
          </p>
          {desde && (
            <p className="mt-1 text-sm text-muted-foreground">
              {MEJORAS.length} cambios desde {mesYAnio(desde)}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ListFilter className="h-4 w-4" aria-hidden />
                Filtrar
                {filtrosActivos > 0 && (
                  <span className="rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                    {filtrosActivos}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Área</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={area}
                onValueChange={(v) => setArea(v as FiltroArea)}
              >
                <DropdownMenuRadioItem value="todas">Todas</DropdownMenuRadioItem>
                {AREAS.map((a) => (
                  <DropdownMenuRadioItem key={a} value={a}>
                    {a}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tipo de cambio</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={tipo}
                onValueChange={(v) => setTipo(v as FiltroTipo)}
              >
                <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
                {TIPOS.map((t) => (
                  <DropdownMenuRadioItem key={t} value={t}>
                    {t}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
              {filtrosActivos > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={limpiarFiltros}>
                    Limpiar filtros
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Copy className="h-4 w-4" aria-hidden />
                Copiar como texto
                <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              {ultimaFecha && (
                <DropdownMenuItem
                  onSelect={() =>
                    copiar(MEJORAS.filter((m) => m.fecha === ultimaFecha))
                  }
                >
                  Lo último ({fechaCorta(ultimaFecha)})
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                disabled={visibles.length === 0}
                onSelect={() => copiar(visibles)}
              >
                Todo lo que se ve ({visibles.length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {filtrosActivos > 0 && (
        <p className="mb-10 text-sm text-muted-foreground">
          {visibles.length} de {MEJORAS.length} cambios ·{" "}
          <button
            type="button"
            onClick={limpiarFiltros}
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Limpiar filtros
          </button>
        </p>
      )}

      <ol>
        {visibles.map((mejora, i) => (
          <Entrada
            key={`${mejora.fecha}-${mejora.titulo}`}
            mejora={mejora}
            esLoUltimo={mejora.fecha === ultimaFecha}
            esLaUltimaFila={i === visibles.length - 1}
          />
        ))}
      </ol>

      {visibles.length === 0 && (
        <p className="text-muted-foreground">
          No hay cambios con estos filtros.{" "}
          <button
            type="button"
            onClick={limpiarFiltros}
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Ver todos
          </button>
        </p>
      )}
    </div>
  );
}

function Entrada({
  mejora,
  esLoUltimo,
  esLaUltimaFila,
}: {
  mejora: Mejora;
  esLoUltimo: boolean;
  esLaUltimaFila: boolean;
}) {
  const { icono: Icono, etiqueta } = ESTILO_TIPO[mejora.tipo];

  return (
    <li className={cn("relative pl-12 sm:pl-14", !esLaUltimaFila && "pb-16 sm:pb-20")}>
      {/* Línea de tiempo: baja desde el nodo hasta la fila siguiente. */}
      {!esLaUltimaFila && (
        <span aria-hidden className="absolute bottom-0 left-[13px] top-9 w-px bg-border" />
      )}
      {/* Nodo: relleno sólo en la última entrega, el resto apagado. */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-md border",
          esLoUltimo
            ? "border-primary bg-primary text-primary-foreground shadow-sm"
            : "bg-background text-muted-foreground"
        )}
      >
        <Icono className="h-3.5 w-3.5" />
      </span>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-16">
        <div className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-lg font-medium leading-snug">{mejora.titulo}</h2>
          <p className="font-mono text-sm text-muted-foreground">
            <time dateTime={mejora.fecha}>{fechaCorta(mejora.fecha)}</time>
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                etiqueta
              )}
            >
              {mejora.tipo}
            </span>
            <span className="text-sm text-muted-foreground">{mejora.area}</span>
          </div>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <h3 className="text-2xl font-normal tracking-tight">Qué cambia</h3>
            <p className="text-base leading-7 text-foreground/75">{mejora.detalle}</p>
          </section>

          {mejora.dondeVerlo && (
            <section className="space-y-4">
              <h3 className="text-2xl font-normal tracking-tight">Dónde verlo</h3>
              <ul className="space-y-3">
                {mejora.dondeVerlo.map((paso) => (
                  <li key={paso} className="flex gap-4 leading-7 text-foreground/75">
                    <span aria-hidden className="text-muted-foreground">
                      –
                    </span>
                    <span>{paso}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </li>
  );
}
