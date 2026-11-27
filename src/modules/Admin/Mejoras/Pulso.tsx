"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MEJORAS, MesDelPulso, ULTIMA_ENTREGA, fechaLarga, pulso } from "./mejoras";
import { ETIQUETA, FOCO, FONDO_ROJO, FONDO_TINTA, LINEA, LINEA_FUERTE, TENUE } from "./estilos";

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/**
 * El "pulso" del sistema: una línea por entrega, en su día del mes y más alta
 * cuantos más cambios trajo. Se ve de un vistazo que el sistema se mueve.
 * Cada mes es un botón que lleva a sus entregas.
 */
export function Pulso({ onElegir }: { onElegir: (fecha: string) => void }) {
  const meses = useMemo(() => pulso(MEJORAS), []);
  const [activo, setActivo] = useState<MesDelPulso | null>(null);
  const maximo = Math.max(1, ...meses.flatMap((m) => m.entregas.map((e) => e.cantidad)));

  const leyenda = activo
    ? activo.entregas.length === 0
      ? `${activo.nombre}: sin entregas`
      : `${activo.nombre}: ${plural(activo.entregas.length, "entrega", "entregas")}, ${plural(
          activo.cambios,
          "cambio",
          "cambios"
        )}`
    : "Cada línea es una entrega · más alta, más cambios";

  return (
    <section aria-label="Pulso del sistema">
      <div className={cn("flex flex-wrap items-baseline justify-between gap-2", ETIQUETA)}>
        <span>Pulso</span>
        <span className={cn(TENUE, "normal-case tracking-normal")} aria-live="polite">
          {leyenda}
        </span>
      </div>

      <div className={cn("mt-3 flex h-24 items-stretch border-b-2", LINEA_FUERTE)}>
        {meses.map((mes, i) => {
          const ultimaDelMes = mes.entregas[mes.entregas.length - 1];
          return (
            <button
              key={mes.clave}
              type="button"
              disabled={!ultimaDelMes}
              onMouseEnter={() => setActivo(mes)}
              onMouseLeave={() => setActivo(null)}
              onFocus={() => setActivo(mes)}
              onBlur={() => setActivo(null)}
              onClick={() => ultimaDelMes && onElegir(ultimaDelMes.fecha)}
              aria-label={
                ultimaDelMes
                  ? `${mes.nombre}: ${plural(mes.entregas.length, "entrega", "entregas")}. Ir a la última, del ${fechaLarga(ultimaDelMes.fecha, false)}`
                  : `${mes.nombre}: sin entregas`
              }
              className={cn(
                "group relative flex-1 border-l transition-colors first:border-l-0 enabled:cursor-pointer enabled:hover:bg-[#1b1e2b]/[0.04] dark:enabled:hover:bg-[#ece6da]/[0.05]",
                LINEA,
                FOCO
              )}
            >
              {mes.entregas.map((entrega, j) => {
                const esLaUltima = entrega.fecha === ULTIMA_ENTREGA;
                return (
                  <motion.span
                    key={entrega.fecha}
                    aria-hidden
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: 0.15 + i * 0.06 + j * 0.04,
                      type: "spring",
                      stiffness: 260,
                      damping: 18,
                    }}
                    style={{
                      left: `${((entrega.dia - 0.5) / mes.diasDelMes) * 100}%`,
                      height: `${22 + (entrega.cantidad / maximo) * 72}%`,
                      // Por framer y no con -translate-x-1/2: framer escribe
                      // el transform en línea y pisaría la clase.
                      x: "-50%",
                      originY: 1,
                    }}
                    className={cn(
                      "absolute bottom-0 w-[3px] rounded-t-full transition-opacity",
                      esLaUltima ? FONDO_ROJO : FONDO_TINTA,
                      !esLaUltima && "opacity-70 group-hover:opacity-100"
                    )}
                  />
                );
              })}
            </button>
          );
        })}
      </div>

      <div className="flex">
        {meses.map((mes) => (
          <span
            key={mes.clave}
            className={cn(
              "flex-1 pt-2 transition-opacity",
              ETIQUETA,
              activo?.clave === mes.clave ? "opacity-100" : TENUE
            )}
          >
            {mes.etiqueta}
          </span>
        ))}
      </div>
    </section>
  );
}
