"use client";

import { Fragment, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Download, FileText } from "lucide-react";
import { copiarAlPortapapeles } from "@/shared/utils/portapapeles";

/**
 * Renderer de markdown mínimo, pensado sólo para lo que devuelve el chatbot:
 * párrafos, listas, tablas de pipes, encabezados, negrita y código inline.
 * Se hace a mano (en vez de sumar una dependencia) y sin dangerouslySetInnerHTML.
 */

// Negrita, cursiva y código inline dentro de una línea.
const renderInline = (texto: string): ReactNode[] => {
  const partes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let ultimo = 0;
  let match: RegExpExecArray | null;
  let clave = 0;

  while ((match = regex.exec(texto)) !== null) {
    if (match.index > ultimo) partes.push(texto.slice(ultimo, match.index));
    const token = match[0];

    if (token.startsWith("**")) {
      partes.push(
        <strong key={clave++} className="font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`")) {
      partes.push(
        <code
          key={clave++}
          className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else {
      partes.push(
        <em key={clave++} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    }
    ultimo = match.index + token.length;
  }

  if (ultimo < texto.length) partes.push(texto.slice(ultimo));
  return partes;
};

// Nacho cierra cada respuesta con datos citando de dónde salieron. Esa línea
// es la trazabilidad de la respuesta, no una oración más: se separa del cuerpo.
const esLineaDeFuente = (linea: string) => /^\s*\**\s*fuentes?\s*:/i.test(linea);

const esFilaDeTabla = (linea: string) =>
  linea.trim().startsWith("|") && linea.trim().endsWith("|");

const esSeparadorDeTabla = (linea: string) =>
  /^\s*\|[\s:|-]+\|\s*$/.test(linea) && linea.includes("-");

const celdas = (linea: string) =>
  linea
    .trim()
    .slice(1, -1)
    .split("|")
    .map((celda) => celda.trim());

// Texto plano de una celda, sin las marcas de markdown: se usa para decidir si
// una columna es numérica y para copiar o exportar la tabla.
const textoPlano = (celda: string) => celda.replace(/\*\*|`|\*/g, "").trim();

// Importes ($ 2.447.767,60), porcentajes, cantidades. Deja afuera los períodos
// (8/2026) y las fechas, que se leen mejor alineados a la izquierda.
const esNumerico = (celda: string) => {
  const plano = textoPlano(celda);
  if (!plano) return false;
  return /^[-+]?\s*\$?\s*\d[\d.,]*\s*%?$/.test(plano);
};

// Una columna se alinea a la derecha si la mayoría de sus celdas con contenido
// son números. Con los montos alineados, comparar una columna es inmediato.
const columnasNumericas = (filas: string[][], cantidadColumnas: number) => {
  const numericas: boolean[] = [];
  for (let columna = 0; columna < cantidadColumnas; columna += 1) {
    const conContenido = filas.map((fila) => fila[columna] ?? "").filter((celda) => textoPlano(celda));
    numericas[columna] =
      conContenido.length > 0 &&
      conContenido.filter(esNumerico).length / conContenido.length >= 0.6;
  }
  return numericas;
};

// La fila de totales que suele cerrar las tablas de Nacho ("Total", "TOTAL",
// "**Total**"): se separa del resto en vez de quedar como una fila más.
const esFilaDeTotal = (fila: string[]) => /^total(es)?\b/i.test(textoPlano(fila[0] ?? ""));

const descargarCSV = (encabezados: string[], filas: string[][]) => {
  const escapar = (celda: string) => `"${textoPlano(celda).replace(/"/g, '""')}"`;
  // Separador de punto y coma: los importes usan la coma como decimal, así que
  // un CSV separado por comas se abre mal en Excel en español.
  const csv = [encabezados, ...filas].map((fila) => fila.map(escapar).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `nacho-${new Date().toISOString().slice(0, 10)}.csv`;
  enlace.click();
  URL.revokeObjectURL(url);
};

const BotonTabla = ({
  onClick,
  titulo,
  children,
}: {
  onClick: () => void;
  titulo: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={titulo}
    aria-label={titulo}
    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
  >
    {children}
  </button>
);

/**
 * Tabla de resultados. Los datos que devuelve Nacho terminan en una planilla o
 * en un reclamo, así que la tabla tiene que poder copiarse tal cual: el botón
 * de copiar usa tabulaciones (se pega en Excel en columnas) y el de descargar
 * arma un CSV con separador de punto y coma.
 */
const TablaMarkdown = ({
  encabezados,
  filas,
}: {
  encabezados: string[];
  filas: string[][];
}) => {
  const [copiado, setCopiado] = useState(false);
  // Mientras la respuesta llega en streaming la tabla se vuelve a dibujar en
  // cada cuadro: sin memo, una tabla de 200 filas revisaría todas sus celdas
  // 60 veces por segundo para decidir la alineación.
  const numericas = useMemo(
    () => columnasNumericas(filas, encabezados.length),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filas.length, encabezados.length]
  );

  // Una tabla ancha (la escala salarial, por ejemplo) se corta en el borde y no
  // hay nada que indique que sigue. El degradado sólo aparece cuando de verdad
  // queda contenido para ese lado.
  const contenedorRef = useRef<HTMLDivElement>(null);
  const [sobra, setSobra] = useState({ izquierda: false, derecha: false });

  const medirDesborde = useCallback(() => {
    const nodo = contenedorRef.current;
    if (!nodo) return;
    const restante = nodo.scrollWidth - nodo.clientWidth - nodo.scrollLeft;
    setSobra({ izquierda: nodo.scrollLeft > 1, derecha: restante > 1 });
  }, []);

  useEffect(() => {
    const nodo = contenedorRef.current;
    if (!nodo) return;
    medirDesborde();
    // Cambia con el ancho del panel y con cada fila que llega en streaming.
    const observador = new ResizeObserver(medirDesborde);
    observador.observe(nodo);
    return () => observador.disconnect();
  }, [medirDesborde, filas.length]);

  const copiar = async () => {
    // Separado por tabulaciones: pegado en Excel cae en columnas.
    const texto = [encabezados, ...filas]
      .map((fila) => fila.map(textoPlano).join("\t"))
      .join("\n");
    if (await copiarAlPortapapeles(texto)) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    }
  };

  // `whitespace-nowrap` en las numéricas: sin eso "$ 33.780.479,96" se parte
  // después del signo y el importe queda en dos renglones.
  const alineacion = (columna: number) =>
    numericas[columna] ? "text-right tabular-nums whitespace-nowrap" : "text-left";

  return (
    <div className="group/tabla animacion-respuesta relative my-4">
      {/* Flotan por encima de la tabla, no sobre la fila de encabezado: ahí
          tapaban el título de la última columna. */}
      <div className="pointer-events-none absolute -top-8 right-0 z-10 flex gap-0.5 rounded-lg border bg-background p-0.5 opacity-0 shadow-sm transition-opacity focus-within:pointer-events-auto focus-within:opacity-100 group-hover/tabla:pointer-events-auto group-hover/tabla:opacity-100">
        <BotonTabla onClick={() => void copiar()} titulo="Copiar la tabla">
          {copiado ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        </BotonTabla>
        <BotonTabla onClick={() => descargarCSV(encabezados, filas)} titulo="Descargar como CSV">
          <Download className="h-3.5 w-3.5" />
        </BotonTabla>
      </div>

      {sobra.izquierda && (
        <div className="pointer-events-none absolute inset-y-px left-px z-[5] w-8 rounded-l-xl bg-gradient-to-r from-background to-transparent" />
      )}
      {sobra.derecha && (
        <div className="pointer-events-none absolute inset-y-px right-px z-[5] w-8 rounded-r-xl bg-gradient-to-l from-background to-transparent" />
      )}

      <div ref={contenedorRef} onScroll={medirDesborde} className="overflow-x-auto rounded-xl border">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-muted/50">
              {encabezados.map((encabezado, indice) => (
                <th
                  key={indice}
                  className={`whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${alineacion(indice)}`}
                >
                  {renderInline(encabezado)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, indiceFila) => {
              const total = esFilaDeTotal(fila);
              return (
                <tr
                  key={indiceFila}
                  className={
                    total
                      ? "border-t-2 border-border bg-muted/30 font-semibold"
                      : "border-t border-border/50 transition-colors hover:bg-muted/40"
                  }
                >
                  {fila.map((celda, indiceCelda) => (
                    <td key={indiceCelda} className={`px-3 py-2 align-top ${alineacion(indiceCelda)}`}>
                      {renderInline(celda)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Escalonado entre bloques. Se topea para que una respuesta larga no tarde
// segundos en terminar de aparecer: a partir del bloque 8 entran todos juntos.
const RETRASO_POR_BLOQUE_MS = 70;
const BLOQUES_ESCALONADOS = 8;

const retrasoDeEntrada = (indice: number) => ({
  style: {
    animationDelay: `${Math.min(indice, BLOQUES_ESCALONADOS) * RETRASO_POR_BLOQUE_MS}ms`,
  },
});

/**
 * `animar`: la entrada desenfocada de cada bloque queda sólo para respuestas
 * que llegan de una vez. Con texto en streaming cada bloque nuevo dispararía
 * una animación con `filter: blur` (una capa compuesta por bloque) mientras
 * el orbe WebGPU sigue dibujando: esa combinación tiró abajo el renderer de
 * Chrome ("Aw, Snap!", código 5).
 */
const Markdown = ({ texto, animar = true }: { texto: string; animar?: boolean }) => {
  const entrada = (indice: number) => (animar ? retrasoDeEntrada(indice) : {});
  const clase = (base: string) => (animar ? `${base} animacion-respuesta` : base);
  const lineas = texto.split("\n");
  const bloques: ReactNode[] = [];
  let i = 0;
  let clave = 0;

  while (i < lineas.length) {
    const linea = lineas[i];
    const indice = clave;
    // Cada rama de abajo tiene que avanzar `i`. Si ninguna lo hace (por
    // ejemplo una fila de tabla sin separador, que en streaming llega antes
    // que la línea siguiente), el loop se repetía para siempre y llenaba la
    // memoria hasta tirar la pestaña. Este guardia lo hace imposible.
    const inicioIteracion = i;

    // Tabla: fila de encabezado + separador + filas
    if (esFilaDeTabla(linea) && i + 1 < lineas.length && esSeparadorDeTabla(lineas[i + 1])) {
      const encabezados = celdas(linea);
      const filas: string[][] = [];
      i += 2;
      while (i < lineas.length && esFilaDeTabla(lineas[i])) {
        filas.push(celdas(lineas[i]));
        i += 1;
      }
      clave += 1;
      bloques.push(
        <div key={indice} {...entrada(indice)} className={clase("")}>
          <TablaMarkdown encabezados={encabezados} filas={filas} />
        </div>
      );
      continue;
    }

    // Encabezados
    const encabezado = linea.match(/^(#{1,4})\s+(.*)$/);
    if (encabezado) {
      clave += 1;
      bloques.push(
        <p key={indice} {...entrada(indice)} className={clase("mt-3 font-semibold first:mt-0")}>
          {renderInline(encabezado[2])}
        </p>
      );
      i += 1;
      continue;
    }

    // Lista con viñetas
    if (/^\s*[-*]\s+/.test(linea)) {
      const items: string[] = [];
      while (i < lineas.length && /^\s*[-*]\s+/.test(lineas[i])) {
        items.push(lineas[i].replace(/^\s*[-*]\s+/, ""));
        i += 1;
      }
      clave += 1;
      bloques.push(
        <ul key={indice} {...entrada(indice)} className={clase("my-1.5 list-disc space-y-0.5 pl-5")}>
          {items.map((item, indice) => (
            <li key={indice}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Lista numerada
    if (/^\s*\d+[.)]\s+/.test(linea)) {
      const items: string[] = [];
      while (i < lineas.length && /^\s*\d+[.)]\s+/.test(lineas[i])) {
        items.push(lineas[i].replace(/^\s*\d+[.)]\s+/, ""));
        i += 1;
      }
      clave += 1;
      bloques.push(
        <ol key={indice} {...entrada(indice)} className={clase("my-1.5 list-decimal space-y-0.5 pl-5")}>
          {items.map((item, indice) => (
            <li key={indice}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Línea en blanco
    if (!linea.trim()) {
      i += 1;
      continue;
    }

    // Párrafo: junta líneas consecutivas
    const parrafo: string[] = [];
    while (
      i < lineas.length &&
      lineas[i].trim() &&
      !esFilaDeTabla(lineas[i]) &&
      !/^\s*[-*]\s+/.test(lineas[i]) &&
      !/^\s*\d+[.)]\s+/.test(lineas[i]) &&
      !/^#{1,4}\s+/.test(lineas[i])
    ) {
      parrafo.push(lineas[i]);
      i += 1;
    }
    // Línea que no encajó en ninguna rama (una fila de tabla todavía sin
    // separador): se muestra tal cual y se sigue.
    if (i === inicioIteracion) {
      parrafo.push(lineas[i]);
      i += 1;
    }
    clave += 1;

    if (parrafo.length === 1 && esLineaDeFuente(parrafo[0])) {
      bloques.push(
        <p
          key={indice}
          {...entrada(indice)}
          className={`animacion-respuesta ${clase(
            "mt-3 flex items-start gap-1.5 border-t pt-2 text-xs text-muted-foreground"
          )}`}
        >
          <FileText className="mt-px h-3.5 w-3.5 shrink-0 opacity-70" />
          {/* Se deja la línea tal cual la escribió el modelo, con su "Fuente:":
              recortar la etiqueta dejaba el pie arrancando en minúscula. */}
          <span>{renderInline(parrafo[0])}</span>
        </p>
      );
      continue;
    }

    bloques.push(
      <p key={indice} {...entrada(indice)} className={clase("my-1.5 first:mt-0 last:mb-0")}>
        {parrafo.map((textoLinea, nLinea) => (
          <Fragment key={nLinea}>
            {nLinea > 0 && <br />}
            {renderInline(textoLinea)}
          </Fragment>
        ))}
      </p>
    );
  }

  return <div className="text-sm leading-relaxed">{bloques}</div>;
};

export default Markdown;
