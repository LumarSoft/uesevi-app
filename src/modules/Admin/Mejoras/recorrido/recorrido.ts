// Presentación de la sección Mejoras en el panel admin: lógica pura (sin
// imports en tiempo de ejecución), la prueba test/recorrido.test.mjs.
//
// - Se muestra una sola vez por navegador: al saltearla o al empezar el
//   recorrido queda marcada como vista en localStorage.
// - El recorrido ilumina, paso a paso, elementos marcados con
//   data-recorrido="..." (menú lateral, página de Mejoras).

/** Cambiar el sufijo vuelve a mostrar la presentación a todos (otra novedad). */
export const CLAVE_ANUNCIO = "uesevi-anuncio-mejoras-v1";

interface Almacen {
  getItem(clave: string): string | null;
  setItem(clave: string, valor: string): void;
}

/**
 * ¿Ya la vio? Si el navegador no deja leer el almacenamiento (modo privado
 * estricto) se toma como vista: mejor no mostrarla que mostrarla en cada carga.
 */
export function anuncioVisto(almacen: Almacen | null | undefined): boolean {
  if (!almacen) return true;
  try {
    return almacen.getItem(CLAVE_ANUNCIO) === "visto";
  } catch {
    return true;
  }
}

export function marcarAnuncioVisto(almacen: Almacen | null | undefined): void {
  try {
    almacen?.setItem(CLAVE_ANUNCIO, "visto");
  } catch {
    // Sin almacenamiento no hay forma de recordarlo; no es grave.
  }
}

export interface PasoRecorrido {
  id: string;
  /** Elemento a iluminar (en pantallas de computadora). */
  selector: string;
  /** En el celular el menú lateral no se ve: se ilumina otra cosa. */
  selectorMovil?: string;
  /** Página donde está el elemento; si no estamos ahí, se navega. */
  ruta?: string;
  titulo: string;
  texto: string;
  textoMovil?: string;
  /** Texto del botón para avanzar (por defecto, "Siguiente"). */
  boton?: string;
}

export const RUTA_MEJORAS = "/admin/mejoras";

export const PASOS: PasoRecorrido[] = [
  {
    id: "menu",
    selector: '[data-recorrido="nav-mejoras"]',
    selectorMovil: '[data-recorrido="menu-movil"]',
    titulo: "Está en el menú",
    texto:
      "Mejoras es la última opción del menú, la del cohete. Entrá cuando quieras ver qué cambió en el sistema.",
    textoMovil:
      "En el celular, abrí el menú desde este botón: Mejoras es la última opción, la del cohete.",
    boton: "Ir a Mejoras",
  },
  {
    id: "cambio",
    selector: '[data-recorrido="mejora-resumen"]',
    ruta: RUTA_MEJORAS,
    titulo: "Cada cambio, de un vistazo",
    texto:
      "Título, fecha, el tipo de cambio (Nuevo, Mejora, Corrección o Seguridad) y la parte del sistema que toca. Lo último va siempre primero, con el ícono en azul.",
  },
  {
    id: "detalle",
    selector: '[data-recorrido="mejora-detalle"]',
    ruta: RUTA_MEJORAS,
    titulo: "Qué cambia y dónde verlo",
    texto:
      "“Qué cambia” lo cuenta en palabras simples. “Dónde verlo” te dice, paso a paso, cómo encontrarlo en el sistema.",
  },
  {
    id: "filtros",
    selector: '[data-recorrido="mejoras-filtros"]',
    ruta: RUTA_MEJORAS,
    titulo: "Filtrá lo que te interesa",
    texto:
      "Con “Filtrar” elegís un área o un tipo de cambio. Los filtros aplicados quedan a la vista y se quitan con la cruz.",
    boton: "Terminar",
  },
];

export interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const MARGEN = 16;
const SEPARACION = 20;

const limitar = (valor: number, min: number, max: number) =>
  Math.max(min, Math.min(valor, max));

/**
 * Dónde va la tarjeta del paso: a la derecha del elemento iluminado si entra
 * (el menú lateral), si no abajo, si no arriba; y si no entra en ningún lado,
 * abajo de todo en la pantalla. Sin elemento (no se encontró), al centro.
 */
export function posicionTarjeta(
  objetivo: Rect | null,
  tarjeta: { ancho: number; alto: number },
  pantalla: { ancho: number; alto: number }
): { top: number; left: number } {
  const { ancho, alto } = tarjeta;
  const maxLeft = Math.max(MARGEN, pantalla.ancho - ancho - MARGEN);
  const maxTop = Math.max(MARGEN, pantalla.alto - alto - MARGEN);

  if (!objetivo) {
    return {
      top: limitar((pantalla.alto - alto) / 2, MARGEN, maxTop),
      left: limitar((pantalla.ancho - ancho) / 2, MARGEN, maxLeft),
    };
  }
  if (objetivo.right + SEPARACION + ancho <= pantalla.ancho - MARGEN) {
    return {
      top: limitar(objetivo.top, MARGEN, maxTop),
      left: objetivo.right + SEPARACION,
    };
  }
  if (objetivo.bottom + SEPARACION + alto <= pantalla.alto - MARGEN) {
    return {
      top: objetivo.bottom + SEPARACION,
      left: limitar(objetivo.left, MARGEN, maxLeft),
    };
  }
  if (objetivo.top - SEPARACION - alto >= MARGEN) {
    return {
      top: objetivo.top - SEPARACION - alto,
      left: limitar(objetivo.left, MARGEN, maxLeft),
    };
  }
  return { top: maxTop, left: limitar(objetivo.left, MARGEN, maxLeft) };
}
