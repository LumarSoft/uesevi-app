"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Mejora, coincide, normalizar, resaltar } from "./mejoras";
import {
  COLOR_TIPO,
  ETIQUETA,
  FOCO,
  FONDO_ROJO,
  FONDO_TINTA,
  LINEA,
  ROJO,
  SERIF,
  SOBRE_TINTA,
  TARJETA,
  TENUE,
} from "./estilos";

export type Vista = "antes" | "ahora";

/** Texto con lo buscado marcado como con resaltador. */
export function Resaltado({ texto, busqueda }: { texto: string; busqueda: string }) {
  return (
    <>
      {resaltar(texto, busqueda).map((tramo, i) =>
        tramo.resaltado ? (
          <mark
            key={i}
            className="rounded-[3px] bg-[#ffe27a] px-0.5 text-inherit dark:bg-[#8a6a00]"
          >
            {tramo.texto}
          </mark>
        ) : (
          <span key={i}>{tramo.texto}</span>
        )
      )}
    </>
  );
}

export function Tarjeta({
  mejora,
  nueva,
  busqueda,
  vistaGeneral,
  cambioDeVista,
}: {
  mejora: Mejora;
  /** Llegó después de la última visita de esta persona. */
  nueva: boolean;
  busqueda: string;
  /** "Antes"/"Ahora" elegido arriba para todas las tarjetas. */
  vistaGeneral: Vista;
  /** Cambia cada vez que se toca el selector general. */
  cambioDeVista: number;
}) {
  const id = useId();
  const [vista, setVista] = useState<Vista>(vistaGeneral);
  const color = COLOR_TIPO[mejora.tipo];

  // El selector general manda sobre todas las tarjetas…
  useEffect(() => {
    setVista(vistaGeneral);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cambioDeVista]);

  // …y si lo buscado sólo aparece en el "antes", se muestra el "antes".
  useEffect(() => {
    if (!mejora.antes || !busqueda.trim()) return;
    const q = normalizar(busqueda.trim());
    const enAntes = normalizar(mejora.antes).includes(q);
    const enLoDemas = coincide({ ...mejora, antes: undefined }, busqueda);
    if (enAntes && !enLoDemas) setVista("antes");
  }, [busqueda, mejora]);

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className={cn(
        "group relative list-none rounded-2xl border p-5 transition-[box-shadow,border-color] duration-200 hover:shadow-[0_14px_36px_-18px_rgba(27,30,43,0.45)] sm:p-6",
        TARJETA,
        nueva ? "border-[#c9431c]/45 dark:border-[#ff8a63]/45" : LINEA
      )}
    >
      <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", ETIQUETA)}>
        <span className={cn("h-1.5 w-1.5 rounded-full", color.punto)} aria-hidden />
        <span className={color.texto}>{mejora.tipo}</span>
        <span className={TENUE}>/ {mejora.area}</span>
        {nueva && (
          <motion.span
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn("ml-auto inline-flex items-center gap-1.5", ROJO)}
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden>
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                  FONDO_ROJO
                )}
              />
              <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", FONDO_ROJO)} />
            </span>
            Nuevo para vos
          </motion.span>
        )}
      </div>

      <h3
        className={cn(
          SERIF,
          "mt-3 text-[1.35rem] font-medium leading-snug [font-variation-settings:'opsz'_48] sm:text-2xl"
        )}
      >
        <Resaltado texto={mejora.titulo} busqueda={busqueda} />
      </h3>

      {mejora.antes ? (
        <div className="mt-4">
          <div
            className={cn(
              "inline-flex rounded-full border p-0.5",
              LINEA,
              ETIQUETA
            )}
            role="group"
            aria-label="Ver cómo era o cómo es"
          >
            {(["antes", "ahora"] as Vista[]).map((opcion) => {
              const activa = vista === opcion;
              return (
                <button
                  key={opcion}
                  type="button"
                  onClick={() => setVista(opcion)}
                  aria-pressed={activa}
                  className={cn(
                    "relative z-10 rounded-full px-3 py-1 transition-colors",
                    FOCO,
                    activa ? SOBRE_TINTA : cn(TENUE, "hover:opacity-100")
                  )}
                >
                  {activa && (
                    <motion.span
                      layoutId={`pastilla-${id}`}
                      className={cn("absolute inset-0 -z-10 rounded-full", FONDO_TINTA)}
                      transition={{ type: "spring", stiffness: 520, damping: 36 }}
                    />
                  )}
                  {opcion === "antes" ? "Antes" : "Ahora"}
                </button>
              );
            })}
          </div>

          <div className="mt-3 min-h-[3.25rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={vista}
                initial={{ opacity: 0, y: vista === "ahora" ? 8 : -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: vista === "ahora" ? -8 : 8 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className={cn(
                  "leading-relaxed",
                  vista === "antes"
                    ? cn(SERIF, TENUE, "text-[1.05rem] italic")
                    : "text-[15px] opacity-85"
                )}
              >
                <Resaltado
                  texto={vista === "antes" ? mejora.antes : mejora.ahora}
                  busqueda={busqueda}
                />
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-[15px] leading-relaxed opacity-85">
          <Resaltado texto={mejora.ahora} busqueda={busqueda} />
        </p>
      )}
    </motion.li>
  );
}
