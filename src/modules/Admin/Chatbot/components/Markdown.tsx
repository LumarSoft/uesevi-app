"use client";

import { Fragment, ReactNode } from "react";

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
        <div key={indice} {...entrada(indice)} className={clase("my-2 overflow-x-auto")}>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border">
                {encabezados.map((encabezado, indice) => (
                  <th key={indice} className="px-2 py-1.5 text-left font-semibold">
                    {renderInline(encabezado)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((fila, indiceFila) => (
                <tr key={indiceFila} className="border-b border-border/40 last:border-0">
                  {fila.map((celda, indiceCelda) => (
                    <td key={indiceCelda} className="px-2 py-1.5 align-top">
                      {renderInline(celda)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
