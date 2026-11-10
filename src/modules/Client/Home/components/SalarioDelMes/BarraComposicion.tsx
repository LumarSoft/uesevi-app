"use client";
import { useEffect, useRef, useState } from "react";
import { IConceptoSalarial } from "@/shared/types/Querys/IComposicionSalarial";
import {
  colorConcepto,
  formatearMonto,
  formatearPorcentaje,
} from "@/shared/utils/composicionSalarial";

const ALTO_BARRA = 28; // px
const SEPARACION = 2; // px de "aire" entre bloques
const ALTO_FILA_ETIQUETA = 16; // px por fila de etiquetas externas
const ALTO_MARCA = 6; // px de la marquita que une bloque y etiqueta

// Ancho estimado del texto: ~7px por carácter a 12px (adentro del bloque lleva
// 16px de padding; afuera, 4px de margen). Nunca recortamos texto.
const anchoTexto = (texto: string, padding: number) =>
  texto.length * 7 + padding;

// Barra segmentada: el salario entero como una sola barra dividida en bloques,
// uno por concepto. El porcentaje va escrito adentro del bloque cuando entra;
// si el bloque es muy angosto (celulares, conceptos chicos) se escribe DEBAJO
// de la barra, centrado bajo su bloque y unido con una marquita del mismo
// color, así se ve siempre sin depender del hover.
// El hover/foco de un bloque se comparte con la lista de referencias
// (`activo` / `onActivo`) para que se iluminen juntos.
export const BarraComposicion = ({
  conceptos,
  total,
  activo,
  onActivo,
}: {
  conceptos: IConceptoSalarial[];
  total: number;
  activo: number | null;
  onActivo: (indice: number | null) => void;
}) => {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [anchoContenedor, setAnchoContenedor] = useState(0);

  // Medimos el ancho real para decidir dónde va cada porcentaje.
  useEffect(() => {
    const el = contenedorRef.current;
    if (!el) return;
    const medir = () => setAnchoContenedor(el.clientWidth);
    medir();
    const observer = new ResizeObserver(medir);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visibles = conceptos
    .map((concepto, i) => ({ concepto, i, monto: Number(concepto.monto) || 0 }))
    .filter((b) => b.monto > 0 && total > 0);

  const anchoUtil = Math.max(
    0,
    anchoContenedor - SEPARACION * (visibles.length - 1)
  );

  // Geometría de cada bloque en px, de izquierda a derecha.
  let x = 0;
  const bloques = visibles.map(({ concepto, i, monto }) => {
    const share = monto / total;
    const ancho = share * anchoUtil;
    const etiqueta = formatearPorcentaje(monto, total);
    const bloque = {
      concepto,
      i,
      monto,
      share,
      etiqueta,
      izquierda: x,
      ancho,
      entraAdentro: ancho >= anchoTexto(etiqueta, 16),
      ...colorConcepto(i),
    };
    x += ancho + SEPARACION;
    return bloque;
  });

  // Etiquetas que no entran: van debajo, centradas bajo su bloque. Si dos
  // quedan muy juntas, la segunda baja una fila para no pisarse.
  const finDeFila: number[] = [];
  const externas = bloques
    .filter((b) => !b.entraAdentro && anchoContenedor > 0)
    .map((b) => {
      const anchoEtiqueta = anchoTexto(b.etiqueta, 4);
      const centro = Math.min(
        Math.max(b.izquierda + b.ancho / 2, anchoEtiqueta / 2),
        anchoContenedor - anchoEtiqueta / 2
      );
      const inicio = centro - anchoEtiqueta / 2;
      let fila = finDeFila.findIndex((fin) => inicio >= fin + 6);
      if (fila === -1) fila = finDeFila.length;
      finDeFila[fila] = centro + anchoEtiqueta / 2;
      return { ...b, centro, fila };
    });
  const filas = finDeFila.length;

  return (
    <div className="relative">
      <div
        ref={contenedorRef}
        role="img"
        aria-label={`Composición del salario: ${bloques
          .map(
            (b) =>
              `${b.concepto.nombre} ${formatearMonto(b.monto)} (${b.etiqueta})`
          )
          .join(", ")}`}
        className="flex w-full items-stretch"
        style={{ gap: SEPARACION, height: ALTO_BARRA }}
      >
        {bloques.map((b) => {
          const atenuado = activo !== null && activo !== b.i;
          return (
            <button
              key={`${b.concepto.nombre}-${b.i}`}
              type="button"
              aria-label={`${b.concepto.nombre}: ${formatearMonto(b.monto)} (${
                b.etiqueta
              })`}
              onMouseEnter={() => onActivo(b.i)}
              onMouseLeave={() => onActivo(null)}
              onFocus={() => onActivo(b.i)}
              onBlur={() => onActivo(null)}
              className="relative flex items-center rounded-[4px] px-2 text-xs font-semibold outline-none transition-[opacity,transform] duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{
                flex: `${b.share} 1 0px`,
                backgroundColor: b.fill,
                color: b.ink,
                opacity: atenuado ? 0.45 : 1,
                transform: activo === b.i ? "scaleY(1.12)" : "scaleY(1)",
              }}
            >
              {b.entraAdentro && (
                <span className="whitespace-nowrap">{b.etiqueta}</span>
              )}
              {activo === b.i && (
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border bg-popover px-3 py-2 text-left text-popover-foreground shadow-md"
                >
                  <span className="block text-sm font-bold">
                    {formatearMonto(b.monto)}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {b.concepto.nombre} · {b.etiqueta}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filas > 0 && (
        <div
          aria-hidden
          className="relative"
          style={{ height: ALTO_MARCA + filas * ALTO_FILA_ETIQUETA }}
        >
          {externas.map((e) => {
            const atenuado = activo !== null && activo !== e.i;
            return (
              <span
                key={`etiqueta-${e.i}`}
                className="transition-opacity duration-200"
                style={{ opacity: atenuado ? 0.45 : 1 }}
              >
                <span
                  className="absolute w-0.5 rounded-b-sm"
                  style={{
                    left: e.centro - 1,
                    top: 0,
                    height: ALTO_MARCA + e.fila * ALTO_FILA_ETIQUETA,
                    backgroundColor: e.fill,
                  }}
                />
                <span
                  className="absolute -translate-x-1/2 whitespace-nowrap text-xs font-semibold leading-4 text-foreground/80 tabular-nums"
                  style={{
                    left: e.centro,
                    top: ALTO_MARCA + e.fila * ALTO_FILA_ETIQUETA,
                  }}
                >
                  {e.etiqueta}
                </span>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};
