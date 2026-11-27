"use client";

// Página "Mejoras" del panel: un changelog. Cada cambio es una fila con dos
// columnas — a la izquierda título, fecha y tipo sobre una línea de tiempo; a
// la derecha "Qué cambia" y, si hay, "Dónde verlo". Los datos viven en
// ./mejoras.ts.
//
// Efecto vidrio en dos lugares: el encabezado (sobre unas luces de color
// difuminadas, que es lo que hace que el vidrio se note) y la barra de
// filtros, que flota fija arriba mientras la línea de tiempo pasa por debajo.

import { useMemo, useState } from "react";
import {
  ListFilter,
  Plus,
  ShieldCheck,
  TrendingUp,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
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
} from "./mejoras";

const ESTILO_TIPO: Record<TipoMejora, { icono: LucideIcon; etiqueta: string }> = {
  Nuevo: {
    icono: Plus,
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

// Superficie de vidrio: translúcida, desenfoca lo de atrás y tiene un borde
// claro apenas visible. Compartida por el encabezado, la barra y el menú.
const VIDRIO =
  "border border-white/70 bg-white/40 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]";

type FiltroArea = "todas" | AreaMejora;
type FiltroTipo = "todos" | TipoMejora;

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

  return (
    <div className="relative isolate">
      {/* Luces de fondo: sin algo de color detrás, el vidrio no se nota. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] overflow-hidden"
      >
        <div className="absolute -top-28 left-[6%] h-80 w-80 rounded-full bg-blue-400/40 blur-3xl dark:bg-blue-500/20" />
        <div className="absolute -top-16 right-[8%] h-72 w-72 rounded-full bg-emerald-300/45 blur-3xl dark:bg-emerald-500/15" />
        <div className="absolute left-[42%] top-28 h-64 w-64 rounded-full bg-violet-300/35 blur-3xl dark:bg-violet-500/15" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-12">
        <header className={cn("rounded-2xl p-6 sm:p-10", VIDRIO)}>
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
        </header>

        {/* Barra de filtros: flota debajo del header fijo del panel (top-20). */}
        <div
          className={cn(
            "sticky top-20 z-10 mb-12 mt-6 flex flex-wrap items-center gap-2 rounded-xl px-3 py-2.5",
            VIDRIO,
            // Más opaca que el encabezado: por debajo pasa texto y, demasiado
            // transparente, se mezclaba con el de la barra.
            "bg-white/80 backdrop-blur-2xl backdrop-saturate-150 dark:bg-background/80"
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-foreground/5"
              >
                <ListFilter className="h-4 w-4" aria-hidden />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 bg-popover/80 backdrop-blur-xl"
            >
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

          {/* Filtros aplicados, a la vista y con su cruz para quitarlos. */}
          {area !== "todas" && (
            <FiltroAplicado
              nombre="Área"
              valor={area}
              onQuitar={() => setArea("todas")}
            />
          )}
          {tipo !== "todos" && (
            <FiltroAplicado
              nombre="Tipo"
              valor={tipo}
              onQuitar={() => setTipo("todos")}
            />
          )}
          {filtrosActivos === 0 && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Todas las áreas y tipos
            </span>
          )}

          <span className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
            {filtrosActivos > 1 && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Limpiar
              </button>
            )}
            <span className="tabular-nums">
              {filtrosActivos > 0
                ? `${visibles.length} de ${MEJORAS.length}`
                : `${MEJORAS.length} cambios`}
            </span>
          </span>
        </div>

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
    </div>
  );
}

function FiltroAplicado({
  nombre,
  valor,
  onQuitar,
}: {
  nombre: string;
  valor: string;
  onQuitar: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 py-1 pl-3 pr-1 text-sm">
      <span className="text-muted-foreground">{nombre}:</span>
      <span className="font-medium">{valor}</span>
      <button
        type="button"
        onClick={onQuitar}
        aria-label={`Quitar el filtro ${nombre.toLowerCase()}: ${valor}`}
        className="ml-0.5 rounded-full p-1 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </span>
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
    <li className={cn("relative pl-12 sm:pl-14", !esLaUltimaFila && "pb-28 sm:pb-32")}>
      {/* Línea de tiempo: baja desde el nodo hasta la fila siguiente. */}
      {!esLaUltimaFila && (
        <span aria-hidden className="absolute bottom-0 left-[13px] top-9 w-px bg-border" />
      )}
      {/* Divisor entre cambios: a mitad del espacio, se desvanece hacia la derecha. */}
      {!esLaUltimaFila && (
        <span
          aria-hidden
          className="absolute bottom-14 left-12 right-0 h-px bg-gradient-to-r from-border via-border/60 to-transparent sm:bottom-16 sm:left-14"
        />
      )}
      {/* Nodo: relleno sólo en la última entrega, el resto apagado. */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-md border",
          esLoUltimo
            ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/30"
            : "bg-background text-muted-foreground"
        )}
      >
        <Icono className="h-3.5 w-3.5" />
      </span>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-16">
        <div className="space-y-3">
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
