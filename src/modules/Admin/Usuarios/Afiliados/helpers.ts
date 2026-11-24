// Buscador del listado de afiliados.
//
// La búsqueda corre en el navegador sobre el listado completo (del orden de mil
// filas), así el resultado cambia al instante mientras se escribe, sin ir al
// servidor en cada tecla.
//
// Reglas (cubiertas por test/buscarAfiliados.test.mjs):
//  - No importan mayúsculas, tildes, eñes ni signos, ni en lo que se escribe ni
//    en lo que está cargado: "martinez" encuentra "MARTÍNEZ", "martínez"
//    encuentra "MARTINEZ", "nunez" y "nuñez" encuentran "Nuñez" y "NUNEZ",
//    "dangelo" encuentra "D'ANGELO". También la Ñ mal codificada ("MU¥OZ").
//  - Cada palabra que se escribe tiene que estar en el apellido o en el nombre,
//    en cualquier orden: "ramiro martinez" = "martinez ramiro".
//  - Los números se buscan en el CUIL, del que sale el DNI: sirve el DNI solo,
//    con o sin puntos, o el CUIL con o sin guiones.
//  - Primero salen las coincidencias más claras (ver `buscarAfiliados`).
//
// Este archivo no importa nada en tiempo de ejecución a propósito: el test lo
// corre directo con Node.

import type { IAfiliado } from "@/shared/types/Querys/IAfiliado";

// Ñ mal codificada, tal como quedó guardada en `usuarios` desde el Excel de
// algunas empresas. Son tres formas de la misma letra, las tres vistas en el
// padrón real:
//   "MU¥OZ"   la Ñ de la codificación de DOS (CP850) leída como Windows-1252
//   "MUÐOZ"   el carácter vecino de la Ñ (U+00D0 en lugar de U+00D1)
//   "MUÃ‘OZ"  la Ñ en UTF-8 leída como Windows-1252
// (y sus gemelas en minúscula). Se leen como "n" para que "muñoz" y "munoz"
// encuentren también a esas personas. Ninguno de estos signos aparece en un
// nombre bien escrito.
//
// Esto es sólo para BUSCAR: el nombre se muestra tal cual está en la base.
const ENIE_ROTA = /\u00c3[\u2018\u0091\u00b1]|[\u00a5\u00a4\u00d0\u00f0]/g;

/** Minúsculas, sin tildes y con los signos convertidos en espacios. */
export const normalizarTexto = (texto: string): string =>
  String(texto ?? "")
    .replace(ENIE_ROTA, "n")
    // NFD separa la letra de su tilde ("á" -> "a" + tilde); después se sacan las
    // marcas sueltas (U+0300 a U+036F): tildes, diéresis y la virgulilla de la ñ.
    // También cubre el texto que ya llega "descompuesto" al pegarlo desde un PDF.
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’‘`´]/g, "") // D'Angelo -> dangelo
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** "20361112227" -> "20-36111222-7". Si no tiene 11 dígitos lo deja como viene. */
export const formatearCuil = (cuil: string): string =>
  /^\d{11}$/.test(cuil)
    ? `${cuil.slice(0, 2)}-${cuil.slice(2, 10)}-${cuil.slice(10)}`
    : cuil;

/** DNI de un CUIL de 11 dígitos: los 8 del medio, sin ceros a la izquierda. */
export const dniDeCuil = (cuil: string): string =>
  /^\d{11}$/.test(cuil) ? cuil.slice(2, 10).replace(/^0+(?=\d)/, "") : "";

/** "36111222" -> "36.111.222" */
export const formatearDni = (dni: string): string =>
  dni.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** "Apellido, Nombre" (o sólo el apellido si no hay nombre). */
export const nombreCompleto = (afiliado: Pick<IAfiliado, "apellido" | "nombre">) =>
  afiliado.nombre ? `${afiliado.apellido}, ${afiliado.nombre}` : afiliado.apellido;

export interface AfiliadoIndexado {
  afiliado: IAfiliado;
  /** Posición en el listado original (alfabético): desempate estable. */
  orden: number;
  palabrasApellido: string[];
  palabrasNombre: string[];
  cuil: string;
  /** 8 dígitos del medio del CUIL, con ceros a la izquierda. */
  dni: string;
  dniSinCeros: string;
}

/**
 * Prepara el listado para buscar. Se hace una sola vez al cargar la página (no en
 * cada tecla): deja cada nombre ya normalizado y partido en palabras.
 */
export const indexarAfiliados = (afiliados: IAfiliado[]): AfiliadoIndexado[] =>
  afiliados.map((afiliado, orden) => {
    const apellido = normalizarTexto(afiliado.apellido);
    const nombre = normalizarTexto(afiliado.nombre);
    const cuil = String(afiliado.cuil ?? "").replace(/\D/g, "");
    const dni = cuil.length === 11 ? cuil.slice(2, 10) : cuil;

    return {
      afiliado,
      orden,
      palabrasApellido: apellido ? apellido.split(" ") : [],
      palabrasNombre: nombre ? nombre.split(" ") : [],
      cuil,
      dni,
      dniSinCeros: dni.replace(/^0+(?=\d)/, ""),
    };
  });

export interface Busqueda {
  /** Palabras a buscar en apellido y nombre, ya normalizadas. */
  palabras: string[];
  /** Todos los dígitos escritos, como un solo número ("" si no hay). */
  numero: string;
}

/**
 * Interpreta lo que escribió el usuario.
 *
 * Todos los dígitos forman UN número, sin importar cómo los separe:
 * "30.123.456", "30 123 456" y "20-30123456-7" se leen de corrido. Una persona
 * tiene un solo documento, así que no tiene sentido buscar dos números a la vez.
 */
export const interpretarBusqueda = (texto: string): Busqueda => {
  const terminos = normalizarTexto(texto).split(" ").filter(Boolean);
  const esNumero = (termino: string) => /^\d+$/.test(termino);

  return {
    palabras: terminos.filter((termino) => !esNumero(termino)),
    numero: terminos.filter(esNumero).join(""),
  };
};

// Qué tan buena es una coincidencia: 0 exacta, 1 empieza igual, 2 está en el medio.
type Calidad = 0 | 1 | 2;

const calidadEnPalabras = (palabras: string[], termino: string): Calidad | null => {
  let mejor: Calidad | null = null;
  for (const palabra of palabras) {
    if (palabra === termino) return 0;
    if (palabra.startsWith(termino)) mejor = 1;
    else if (mejor === null && palabra.includes(termino)) mejor = 2;
  }
  return mejor;
};

// Apellido o nombre compuesto escrito todo junto: "delvalle" -> DEL VALLE,
// "delafuente" -> DE LA FUENTE, "lopresti" -> LO PRESTI, "sanmartin" -> SAN MARTIN.
//
// Sólo se pegan las partículas cortas (hasta 3 letras) con la palabra que sigue.
// Pegar cualquier par de palabras da falsos positivos: "Martin Ezequiel" pegado
// es "martinezequiel", y aparecería al buscar "martinez".
const LARGO_MAXIMO_PARTICULA = 3;

const coincidePegado = (palabras: string[], termino: string): boolean => {
  for (let desde = 0; desde < palabras.length - 1; desde++) {
    let pegado = "";
    for (let hasta = desde; hasta < palabras.length; hasta++) {
      pegado += palabras[hasta];
      if (hasta > desde && pegado.startsWith(termino)) return true;
      if (palabras[hasta].length > LARGO_MAXIMO_PARTICULA) break;
    }
  }
  return false;
};

/** Calidad de la coincidencia dentro de un campo (el apellido o el nombre). */
const calidadEnCampo = (palabras: string[], termino: string): Calidad | null => {
  const enPalabras = calidadEnPalabras(palabras, termino);
  if (enPalabras !== null) return enPalabras;
  return coincidePegado(palabras, termino) ? 1 : null;
};

const mejorCalidad = (a: Calidad | null, b: Calidad | null): Calidad | null => {
  if (a === null) return b;
  if (b === null) return a;
  return a < b ? a : b;
};

const calidadDePalabra = (item: AfiliadoIndexado, termino: string): Calidad | null =>
  mejorCalidad(
    calidadEnCampo(item.palabrasApellido, termino),
    calidadEnCampo(item.palabrasNombre, termino)
  );

// Dónde aparece el término: 0 al comienzo del apellido, 1 al comienzo de otra
// palabra del apellido, 2 en el nombre (o en el medio de una palabra).
const lugarEnElNombre = (item: AfiliadoIndexado, termino: string): number => {
  if (item.palabrasApellido[0]?.startsWith(termino)) return 0;
  const enApellido = calidadEnCampo(item.palabrasApellido, termino);
  return enApellido === 0 || enApellido === 1 ? 1 : 2;
};

const calidadDeNumero = (item: AfiliadoIndexado, numero: string): Calidad | null => {
  if (numero === item.cuil || numero === item.dni || numero === item.dniSinCeros) {
    return 0;
  }
  if (
    item.dni.startsWith(numero) ||
    item.dniSinCeros.startsWith(numero) ||
    item.cuil.startsWith(numero)
  ) {
    return 1;
  }
  return item.cuil.includes(numero) ? 2 : null;
};

/**
 * Filtra y ordena los afiliados según lo que se escribió.
 *
 * Un afiliado aparece sólo si coinciden TODAS las palabras y el número.
 * Orden del resultado:
 *  1. Primero los que coinciden desde el principio de una palabra (o del
 *     documento); al final los que sólo coinciden "en el medio" ("ana" en
 *     "Susana").
 *  2. Dentro de cada grupo, según dónde está lo primero que se escribió: al
 *     comienzo del apellido ("m" -> MARTINEZ), en otra palabra del apellido
 *     ("m" -> DI MARCO) y por último en el nombre.
 *  3. Después las coincidencias exactas antes que las parciales ("Martin" antes
 *     que "Martinez").
 *  4. A igualdad, alfabético (el orden en que llega el listado).
 *
 * Sin nada escrito devuelve el listado completo, en su orden original.
 */
export const buscarAfiliados = (
  indice: AfiliadoIndexado[],
  texto: string
): IAfiliado[] => {
  const { palabras, numero } = interpretarBusqueda(texto);

  if (palabras.length === 0 && !numero) {
    return indice.map((item) => item.afiliado);
  }

  const encontrados: {
    item: AfiliadoIndexado;
    enElMedio: number;
    lugar: number;
    suma: number;
  }[] = [];

  for (const item of indice) {
    let suma = 0;
    let peor: Calidad = 0;
    let coincide = true;

    for (const palabra of palabras) {
      const calidad = calidadDePalabra(item, palabra);
      if (calidad === null) {
        coincide = false;
        break;
      }
      suma += calidad;
      if (calidad > peor) peor = calidad;
    }
    if (!coincide) continue;

    if (numero) {
      const calidad = calidadDeNumero(item, numero);
      if (calidad === null) continue;
      suma += calidad;
      if (calidad > peor) peor = calidad;
    }

    encontrados.push({
      item,
      enElMedio: peor === 2 ? 1 : 0,
      lugar: palabras.length === 0 ? 0 : lugarEnElNombre(item, palabras[0]),
      suma,
    });
  }

  encontrados.sort(
    (a, b) =>
      a.enElMedio - b.enElMedio ||
      a.lugar - b.lugar ||
      a.suma - b.suma ||
      a.item.orden - b.item.orden
  );

  return encontrados.map((encontrado) => encontrado.item.afiliado);
};
