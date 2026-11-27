"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AREAS,
  AreaMejora,
  Entrega,
  FECHAS_DE_ENTREGA,
  MEJORAS,
  ULTIMA_ENTREGA,
  agruparPorFecha,
  coincide,
  fechaDeCorte,
  fechaLarga,
  haceCuanto,
  nombreDelMes,
} from "./mejoras";
import { useMarcarNovedadesVistas } from "./useNovedades";
import { mono, serif } from "./fuentes";
import { Pulso } from "./Pulso";
import { Tarjeta, Vista } from "./Tarjeta";
import {
  ETIQUETA,
  FOCO,
  FONDO_ROJO,
  FONDO_TINTA,
  LINEA,
  LINEA_FUERTE,
  PAPEL,
  ROJO,
  SERIF,
  SOBRE_TINTA,
  TARJETA,
  TENUE,
  TINTA,
} from "./estilos";

type Filtro = "Todas" | AreaMejora;

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

export default function BoletinDeMejoras() {
  const reducirMovimiento = useReducedMotion();
  const vistaPrevia = useMarcarNovedadesVistas();
  // Mientras se lee lo que la persona ya vio, no se marca nada como nuevo.
  const corte = vistaPrevia === undefined ? null : fechaDeCorte(vistaPrevia);

  const [busqueda, setBusqueda] = useState("");
  const [area, setArea] = useState<Filtro>("Todas");
  const [vista, setVista] = useState<Vista>("ahora");
  const [cambioDeVista, setCambioDeVista] = useState(0);
  const [resaltada, setResaltada] = useState<string | null>(null);
  const temporizador = useRef<number>();
  const inicioDeLaLista = useRef<HTMLDivElement>(null);
  const primerRender = useRef(true);

  // Al buscar o filtrar desde más abajo, la lista se achica y los resultados
  // quedaban arriba, fuera de la vista: se vuelve al comienzo de la lista.
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    const ancla = inicioDeLaLista.current;
    if (ancla && ancla.getBoundingClientRect().top < 64) {
      ancla.scrollIntoView({ block: "start" });
    }
  }, [busqueda, area]);

  const visibles = useMemo(
    () =>
      MEJORAS.filter(
        (m) => (area === "Todas" || m.area === area) && coincide(m, busqueda)
      ),
    [area, busqueda]
  );
  const entregas = useMemo(() => agruparPorFecha(visibles), [visibles]);
  const nuevas = corte === null ? 0 : MEJORAS.filter((m) => m.fecha > corte).length;
  const buscando = busqueda.trim().length > 0;

  const elegirVista = (v: Vista) => {
    setVista(v);
    setCambioDeVista((n) => n + 1);
  };

  const limpiar = () => {
    setBusqueda("");
    setArea("Todas");
  };

  // Desde el pulso: muestra todo, baja hasta la entrega y la destaca un momento.
  const irAEntrega = (fecha: string) => {
    limpiar();
    // Un instante para que React vuelva a dibujar la lista completa. Con
    // setTimeout y no requestAnimationFrame: éste no corre con la pestaña en
    // segundo plano.
    window.setTimeout(() => {
      document.getElementById(`entrega-${fecha}`)?.scrollIntoView({
        behavior: reducirMovimiento ? "auto" : "smooth",
        block: "start",
      });
      setResaltada(fecha);
      window.clearTimeout(temporizador.current);
      temporizador.current = window.setTimeout(() => setResaltada(null), 1800);
    }, 60);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn(
          serif.variable,
          mono.variable,
          PAPEL,
          TINTA,
          "rounded-3xl border shadow-sm",
          LINEA
        )}
      >
        {/* ---------- Cabecera ---------- */}
        <header className="px-5 pb-8 pt-7 sm:px-10 sm:pt-10">
          <div className={cn("flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1", ETIQUETA, TENUE)}>
            <span>UESEVI · Sistema de gestión</span>
            {ULTIMA_ENTREGA && (
              <span>
                N.º {FECHAS_DE_ENTREGA.length} · {fechaLarga(ULTIMA_ENTREGA)}
              </span>
            )}
          </div>
          <div className={cn("mt-3 border-t-2", LINEA_FUERTE)} />
          <div className={cn("mt-[3px] border-t", LINEA_FUERTE)} />

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              SERIF,
              "mt-7 text-[2.9rem] font-semibold leading-[0.92] tracking-[-0.02em] [font-variation-settings:'SOFT'_60,'opsz'_144] sm:text-7xl"
            )}
          >
            Boletín de <em className={cn("font-normal italic", ROJO)}>mejoras</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={cn(SERIF, TENUE, "mt-4 max-w-2xl text-lg italic leading-snug sm:text-xl")}
          >
            Lo que fuimos cambiando en el sistema, entrega por entrega: qué pasaba
            antes y qué pasa ahora.
          </motion.p>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-7 flex flex-wrap gap-x-10 gap-y-4"
          >
            <Dato valor={String(MEJORAS.length)} etiqueta="cambios" />
            <Dato valor={String(FECHAS_DE_ENTREGA.length)} etiqueta="entregas" />
            {ULTIMA_ENTREGA && (
              <Dato valor={haceCuanto(ULTIMA_ENTREGA)} etiqueta="la última" cursiva />
            )}
          </motion.dl>

          <AnimatePresence>
            {nuevas > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "mt-7 inline-flex items-center gap-2.5 rounded-full border border-[#c9431c]/30 bg-[#c9431c]/[0.07] px-3.5 py-1.5 text-sm font-medium dark:border-[#ff8a63]/30 dark:bg-[#ff8a63]/10",
                  ROJO
                )}
              >
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", FONDO_ROJO)} />
                  <span className={cn("relative inline-flex h-2 w-2 rounded-full", FONDO_ROJO)} />
                </span>
                {plural(nuevas, "cambio nuevo", "cambios nuevos")} desde tu última visita
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-10">
            <Pulso onElegir={irAEntrega} />
          </div>
        </header>

        {/* ---------- Búsqueda y filtros ---------- */}
        <div ref={inicioDeLaLista} className="scroll-mt-16" aria-hidden />
        <div
          className={cn(
            "z-10 flex flex-wrap items-center gap-x-4 gap-y-3 border-y px-5 py-3 backdrop-blur md:sticky md:top-16 sm:px-10",
            LINEA,
            "bg-[#f6f2e9]/90 dark:bg-[#11131a]/90"
          )}
        >
          <label className="relative block min-w-[220px] flex-1">
            <span className="sr-only">Buscar un cambio</span>
            <Search className={cn("pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", TENUE)} aria-hidden />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setBusqueda("")}
              placeholder="Buscar: intereses, login, WhatsApp…"
              className={cn(
                "w-full rounded-full border py-2 pl-9 pr-9 text-sm placeholder:opacity-60 [&::-webkit-search-cancel-button]:hidden",
                TARJETA,
                LINEA,
                FOCO
              )}
            />
            {buscando && (
              <button
                type="button"
                onClick={() => setBusqueda("")}
                aria-label="Borrar la búsqueda"
                className={cn("absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:opacity-70", FOCO)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </label>

          <LayoutGroup id="areas">
            <div
              role="group"
              aria-label="Filtrar por área"
              className="order-last -mx-1 flex basis-full gap-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none]"
            >
              {(["Todas", ...AREAS] as Filtro[]).map((opcion) => {
                const activa = area === opcion;
                const cantidad = MEJORAS.filter(
                  (m) => (opcion === "Todas" || m.area === opcion) && coincide(m, busqueda)
                ).length;
                return (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => setArea(opcion)}
                    aria-pressed={activa}
                    className={cn(
                      "relative z-10 shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors",
                      FOCO,
                      activa ? SOBRE_TINTA : "hover:bg-[#1b1e2b]/[0.06] dark:hover:bg-[#ece6da]/[0.08]"
                    )}
                  >
                    {activa && (
                      <motion.span
                        layoutId="area-activa"
                        className={cn("absolute inset-0 -z-10 rounded-full", FONDO_TINTA)}
                        transition={{ type: "spring", stiffness: 480, damping: 38 }}
                      />
                    )}
                    {opcion}
                    <span className={cn("ml-1.5 tabular-nums", activa ? "opacity-70" : TENUE)}>
                      {cantidad}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>

          <div className={cn("flex items-center gap-2", ETIQUETA)}>
            <span className={TENUE}>Ver</span>
            <LayoutGroup id="vista">
              <div className={cn("inline-flex rounded-full border p-0.5", LINEA)} role="group" aria-label="Ver todo como era o como es">
                {(["antes", "ahora"] as Vista[]).map((opcion) => {
                  const activa = vista === opcion;
                  return (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => elegirVista(opcion)}
                      aria-pressed={activa}
                      className={cn(
                        "relative z-10 rounded-full px-3 py-1 transition-colors",
                        FOCO,
                        activa ? SOBRE_TINTA : TENUE
                      )}
                    >
                      {activa && (
                        <motion.span
                          layoutId="vista-general"
                          className={cn("absolute inset-0 -z-10 rounded-full", FONDO_TINTA)}
                          transition={{ type: "spring", stiffness: 520, damping: 36 }}
                        />
                      )}
                      {opcion === "antes" ? "Antes" : "Ahora"}
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          </div>
        </div>

        {/* ---------- Entregas ---------- */}
        <div className="px-5 pb-6 sm:px-10">
          {buscando && (
            <p className={cn("pt-6", ETIQUETA, TENUE)} aria-live="polite">
              {plural(visibles.length, "resultado", "resultados")} para “{busqueda.trim()}”
            </p>
          )}

          <AnimatePresence initial={false} mode="popLayout">
            {entregas.map((entrega) => (
              <EntregaDelBoletin
                key={entrega.fecha}
                entrega={entrega}
                corte={corte}
                busqueda={busqueda}
                vista={vista}
                cambioDeVista={cambioDeVista}
                resaltada={resaltada === entrega.fecha}
              />
            ))}
          </AnimatePresence>

          {entregas.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-20 text-center"
            >
              <p className={cn(SERIF, "text-4xl italic")}>Nada por acá.</p>
              <p className={cn("mt-3", TENUE)}>
                No hay cambios que coincidan
                {buscando ? <> con “{busqueda.trim()}”</> : null}
                {area !== "Todas" ? <> en {area}</> : null}.
              </p>
              <button
                type="button"
                onClick={limpiar}
                className={cn("mt-5 underline decoration-2 underline-offset-4", ROJO, FOCO)}
              >
                Ver todos los cambios
              </button>
            </motion.div>
          )}
        </div>

        <footer
          className={cn(
            "flex flex-wrap justify-between gap-2 border-t px-5 py-5 sm:px-10",
            LINEA,
            ETIQUETA,
            TENUE
          )}
        >
          <span>Fin del boletín</span>
          <span>Se actualiza con cada entrega</span>
        </footer>
      </div>
    </MotionConfig>
  );
}

function Dato({ valor, etiqueta, cursiva }: { valor: string; etiqueta: string; cursiva?: boolean }) {
  return (
    <div>
      <dt className={cn(ETIQUETA, TENUE)}>{etiqueta}</dt>
      <dd
        className={cn(
          SERIF,
          "mt-1 text-4xl leading-none tabular-nums [font-variation-settings:'opsz'_144]",
          cursiva && "italic"
        )}
      >
        {valor}
      </dd>
    </div>
  );
}

function EntregaDelBoletin({
  entrega,
  corte,
  busqueda,
  vista,
  cambioDeVista,
  resaltada,
}: {
  entrega: Entrega;
  corte: string | null;
  busqueda: string;
  vista: Vista;
  cambioDeVista: number;
  resaltada: boolean;
}) {
  const esLaUltima = entrega.fecha === ULTIMA_ENTREGA;
  const [anio, , dia] = entrega.fecha.split("-");

  return (
    <motion.article
      layout="position"
      id={`entrega-${entrega.fecha}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "relative grid scroll-mt-40 gap-5 border-t py-9 transition-colors duration-700 first:border-t-0 md:grid-cols-[170px_1fr] md:gap-10",
        LINEA
      )}
    >
      {/* Destello al llegar desde el pulso */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: resaltada ? 1 : 0 }}
        transition={{ duration: resaltada ? 0.2 : 1.2 }}
        className="pointer-events-none absolute -inset-x-3 inset-y-3 rounded-2xl bg-[#c9431c]/[0.06] ring-1 ring-[#c9431c]/25 dark:bg-[#ff8a63]/[0.07] dark:ring-[#ff8a63]/25 sm:-inset-x-5"
      />

      <div className="relative self-start md:sticky md:top-40">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 md:block">
          <p className={cn(ETIQUETA, TENUE)}>N.º {entrega.numero}</p>
          <p
            className={cn(
              SERIF,
              "text-6xl font-semibold leading-none tabular-nums [font-variation-settings:'opsz'_144] md:mt-2 md:text-7xl"
            )}
          >
            {Number(dia)}
          </p>
          <p className={cn(SERIF, "text-xl italic md:mt-1")}>{nombreDelMes(entrega.fecha)}</p>
          <p className={cn(ETIQUETA, TENUE, "md:mt-2")}>
            {anio} · {haceCuanto(entrega.fecha)}
          </p>
        </div>
        <p className={cn(ETIQUETA, TENUE, "mt-2 normal-case tracking-normal")}>
          {plural(entrega.mejoras.length, "cambio", "cambios")}
        </p>
        {esLaUltima && (
          <motion.span
            initial={{ opacity: 0, scale: 1.4, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: -4 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 14 }}
            className={cn(
              "mt-4 inline-block rounded-md border-2 border-current px-2 py-1 text-[10px] font-bold",
              ETIQUETA,
              ROJO
            )}
          >
            Última entrega
          </motion.span>
        )}
      </div>

      <ul className="relative space-y-4">
        <AnimatePresence initial={false} mode="popLayout">
          {entrega.mejoras.map((mejora) => (
            <Tarjeta
              key={`${mejora.fecha}-${mejora.titulo}`}
              mejora={mejora}
              nueva={corte !== null && mejora.fecha > corte}
              busqueda={busqueda}
              vistaGeneral={vista}
              cambioDeVista={cambioDeVista}
            />
          ))}
        </AnimatePresence>
      </ul>
    </motion.article>
  );
}
