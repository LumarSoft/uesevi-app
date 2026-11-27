"use client";

// Página "Mejoras" del panel: un changelog. Cada cambio es una fila con dos
// columnas — a la izquierda título, fecha y tipo sobre una línea de tiempo; a
// la derecha "Qué cambia" y, si hay, "Dónde verlo". Los datos viven en
// ./mejoras.ts. Estética sobria, a lo changelog de Supabase: sin tarjetas ni
// fondos, sólo tipografía, la línea de tiempo y divisores.
//
// Segunda pestaña, "Propuestas": el personal propone mejoras y el equipo de
// desarrollo responde (./propuestas/, API /propuestas).

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Compass,
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
import { fetchData } from "@/services/mysql/functions";
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
import { useRecorridoMejoras } from "./recorrido/estado";
import { Propuesta } from "./propuestas/propuestas";
import SeccionPropuestas from "./propuestas/SeccionPropuestas";

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

type FiltroArea = "todas" | AreaMejora;
type FiltroTipo = "todos" | TipoMejora;
type Vista = "cambios" | "propuestas";

export default function MejorasModule() {
  const [vista, setVista] = useState<Vista>("cambios");
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

  // Propuestas: se traen al entrar para mostrar cuántas hay en la pestaña.
  const [propuestas, setPropuestas] = useState<Propuesta[]>([]);
  const [puedeResponder, setPuedeResponder] = useState(false);
  const [cargandoPropuestas, setCargandoPropuestas] = useState(true);
  const [errorPropuestas, setErrorPropuestas] = useState<string | null>(null);
  useEffect(() => {
    let vigente = true;
    (async () => {
      const resultado = await fetchData("propuestas");
      if (!vigente) return;
      if (resultado?.ok && resultado.data) {
        setPropuestas(resultado.data.propuestas ?? []);
        setPuedeResponder(Boolean(resultado.data.puedeResponder));
      } else {
        setErrorPropuestas("probá de nuevo en un rato.");
      }
      setCargandoPropuestas(false);
    })();
    return () => {
      vigente = false;
    };
  }, []);
  const alCambiarPropuesta = (propuesta: Propuesta) =>
    setPropuestas((lista) =>
      lista.some((p) => p.id === propuesta.id)
        ? lista.map((p) => (p.id === propuesta.id ? propuesta : p))
        : [propuesta, ...lista]
    );

  // ¿La barra de filtros quedó pegada arriba? Un centinela justo antes de
  // ella deja de verse cuando la barra se fija, y ahí le sumamos sombra.
  const centinelaRef = useRef<HTMLDivElement>(null);
  const [barraFija, setBarraFija] = useState(false);
  useEffect(() => {
    const centinela = centinelaRef.current;
    if (!centinela || typeof IntersectionObserver === "undefined") return;
    const observador = new IntersectionObserver(
      ([entrada]) =>
        setBarraFija(
          !entrada.isIntersecting &&
            entrada.boundingClientRect.top < (entrada.rootBounds?.top ?? 0) + 20
        ),
      // El que scrollea es el <main> del layout; el contenedor se pega en top-0.
      { root: centinela.closest("main"), rootMargin: "-1px 0px 0px 0px" }
    );
    observador.observe(centinela);
    return () => observador.disconnect();
    // La barra sólo existe en la pestaña Cambios: al volver, se observa de nuevo.
  }, [vista]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:py-12">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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
        {/* Vuelve a abrir la presentación completa (bienvenida + recorrido,
            recorrido/RecorridoMejoras.tsx), aunque ya se haya visto. */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 self-start sm:self-auto"
          onClick={() => useRecorridoMejoras.getState().abrirBienvenida()}
        >
          <Compass className="h-4 w-4" aria-hidden />
          Ver presentación
        </Button>
      </header>

      <div role="tablist" aria-label="Secciones de Mejoras" className="flex gap-6 border-b">
        <Pestania
          id="cambios"
          activa={vista === "cambios"}
          onClick={() => setVista("cambios")}
          cantidad={MEJORAS.length}
        >
          Cambios
        </Pestania>
        <Pestania
          id="propuestas"
          activa={vista === "propuestas"}
          onClick={() => setVista("propuestas")}
          cantidad={cargandoPropuestas || errorPropuestas ? null : propuestas.length}
          recorrido="mejoras-propuestas"
        >
          Propuestas
        </Pestania>
      </div>

      {vista === "propuestas" ? (
        <div role="tabpanel" id="panel-propuestas" aria-labelledby="pestania-propuestas" className="mt-10">
          <SeccionPropuestas
            propuestas={propuestas}
            puedeResponder={puedeResponder}
            cargando={cargandoPropuestas}
            error={errorPropuestas}
            onCambio={alCambiarPropuesta}
          />
        </div>
      ) : (
        <div role="tabpanel" id="panel-cambios" aria-labelledby="pestania-cambios">
          {/* Barra de filtros: queda fija arriba al bajar. El contenedor pegajoso
              lleva el fondo de la página (el mismo de <main>: background + un 10 %
              de secondary) para tapar la franja entre el header y la barra; si no,
              el texto se veía pasar por ahí. La barra tiene borde y sombra suave
              para no perderse sobre el fondo claro, y más sombra cuando está fija. */}
          <div ref={centinelaRef} aria-hidden className="h-px" />
          <div className="sticky top-0 z-10 mb-12 bg-background pt-4 before:absolute before:inset-0 before:-z-10 before:bg-secondary/10">
            <div
              data-recorrido="mejoras-filtros"
              className={cn(
                "flex flex-wrap items-center gap-2 rounded-xl border border-foreground/[0.12] bg-background px-3 py-2.5 shadow-sm transition-shadow duration-200 dark:border-border",
                barraFija && "shadow-md shadow-black/[0.08] dark:shadow-black/40"
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
                  className="w-56"
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
          </div>

          <ol>
            {visibles.map((mejora, i) => (
              <Entrada
                key={`${mejora.fecha}-${mejora.titulo}`}
                mejora={mejora}
                esLoUltimo={mejora.fecha === ultimaFecha}
                esLaPrimeraFila={i === 0}
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
      )}
    </div>
  );
}

/** Pestaña con subrayado, a lo Supabase. */
function Pestania({
  id,
  activa,
  onClick,
  cantidad,
  recorrido,
  children,
}: {
  id: string;
  activa: boolean;
  onClick: () => void;
  cantidad: number | null;
  recorrido?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={`pestania-${id}`}
      aria-selected={activa}
      aria-controls={`panel-${id}`}
      onClick={onClick}
      data-recorrido={recorrido}
      className={cn(
        "-mb-px flex items-center gap-2 border-b-2 px-1 pb-3 pt-1 text-sm font-medium transition-colors",
        activa
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
      {cantidad !== null && (
        <span
          className={cn(
            "rounded-full px-1.5 text-xs tabular-nums",
            activa ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          {cantidad}
        </span>
      )}
    </button>
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
  esLaPrimeraFila,
  esLaUltimaFila,
}: {
  mejora: Mejora;
  esLoUltimo: boolean;
  esLaPrimeraFila: boolean;
  esLaUltimaFila: boolean;
}) {
  // La primera fila es la que muestra el recorrido de presentación.
  const marca = (nombre: string) => (esLaPrimeraFila ? nombre : undefined);
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
        {/* self-start: que no se estire al alto de la fila (el recorrido
            ilumina esta columna y quedaba un recuadro vacío). */}
        <div className="space-y-3 self-start" data-recorrido={marca("mejora-resumen")}>
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

        <div className="space-y-10" data-recorrido={marca("mejora-detalle")}>
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
