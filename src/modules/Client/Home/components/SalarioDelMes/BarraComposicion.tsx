"use client";
import { useEffect, useRef, useState } from "react";
import { IConceptoSalarial } from "@/shared/types/Querys/IComposicionSalarial";
import {
  colorConcepto,
  formatearMonto,
  formatearPorcentaje,
} from "@/shared/utils/composicionSalarial";

// Barra segmentada: el salario entero como una sola barra dividida en bloques,
// uno por concepto, con el porcentaje escrito adentro cuando entra.
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

  // Medimos el ancho real para decidir si el porcentaje entra en el bloque
  // (nunca recortamos texto: si no entra, no se dibuja y queda en la lista).
  useEffect(() => {
    const el = contenedorRef.current;
    if (!el) return;
    const medir = () => setAnchoContenedor(el.clientWidth);
    medir();
    const observer = new ResizeObserver(medir);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const separacion = 2; // px de "aire" entre bloques
  const anchoUtil = Math.max(
    0,
    anchoContenedor - separacion * (conceptos.length - 1)
  );

  return (
    <div className="relative">
      <div
        ref={contenedorRef}
        role="img"
        aria-label={`Composición del salario: ${conceptos
          .map(
            (c) =>
              `${c.nombre} ${formatearMonto(c.monto)} (${formatearPorcentaje(
                c.monto,
                total
              )})`
          )
          .join(", ")}`}
        className="flex w-full items-stretch"
        style={{ gap: separacion, height: 28 }}
      >
        {conceptos.map((concepto, i) => {
          const monto = Number(concepto.monto) || 0;
          if (monto <= 0 || total <= 0) return null;

          const share = monto / total;
          const anchoBloque = share * anchoUtil;
          const etiqueta = formatearPorcentaje(monto, total);
          // ~7px por carácter a 12px + 16px de padding: si no entra, no se escribe.
          const entraEtiqueta = anchoBloque >= etiqueta.length * 7 + 16;
          const { fill, ink } = colorConcepto(i);
          const atenuado = activo !== null && activo !== i;

          return (
            <button
              key={`${concepto.nombre}-${i}`}
              type="button"
              aria-label={`${concepto.nombre}: ${formatearMonto(
                monto
              )} (${etiqueta})`}
              onMouseEnter={() => onActivo(i)}
              onMouseLeave={() => onActivo(null)}
              onFocus={() => onActivo(i)}
              onBlur={() => onActivo(null)}
              className="relative flex items-center rounded-[4px] px-2 text-xs font-semibold outline-none transition-[opacity,transform] duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              style={{
                flex: `${share} 1 0px`,
                backgroundColor: fill,
                color: ink,
                opacity: atenuado ? 0.45 : 1,
                transform: activo === i ? "scaleY(1.12)" : "scaleY(1)",
              }}
            >
              {entraEtiqueta && (
                <span className="whitespace-nowrap">{etiqueta}</span>
              )}
              {activo === i && (
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border bg-popover px-3 py-2 text-left text-popover-foreground shadow-md"
                >
                  <span className="block text-sm font-bold">
                    {formatearMonto(monto)}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {concepto.nombre} · {etiqueta}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
