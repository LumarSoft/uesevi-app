// Propuestas de mejora (Mejoras → Propuestas): tipos y lógica pura, sin
// imports en tiempo de ejecución (lo prueba test/propuestas.test.mjs).
// La API es /propuestas (Uesevi-api: propuestasController / utils/propuestas.js);
// los límites de acá tienen que coincidir con los de allá.

export type EstadoPropuesta = "pendiente" | "en_curso" | "hecha" | "descartada";

export interface Propuesta {
  id: number;
  titulo: string;
  descripcion: string;
  area: string | null;
  estado: EstadoPropuesta;
  respuesta: string | null;
  created: string;
  respondida_en: string | null;
  autor: string | null;
  respondida_por: string | null;
  /** La propuso quien está mirando. */
  esMia: boolean;
}

export const ESTADOS_PROPUESTA: EstadoPropuesta[] = [
  "pendiente",
  "en_curso",
  "hecha",
  "descartada",
];

export const ETIQUETA_ESTADO: Record<EstadoPropuesta, string> = {
  pendiente: "Recibida",
  en_curso: "En curso",
  hecha: "Hecha",
  descartada: "No por ahora",
};

export const LIMITES = {
  tituloMin: 5,
  tituloMax: 120,
  descripcionMin: 10,
  descripcionMax: 2000,
  respuestaMax: 2000,
};

/** Lo mismo que valida la API, para avisar antes de enviar. */
export function erroresDePropuesta(titulo: string, descripcion: string): string[] {
  const errores: string[] = [];
  const t = titulo.trim();
  const d = descripcion.trim();
  if (t.length < LIMITES.tituloMin) errores.push("Poné un título un poco más largo.");
  if (t.length > LIMITES.tituloMax) {
    errores.push(`El título puede tener hasta ${LIMITES.tituloMax} caracteres.`);
  }
  if (d.length < LIMITES.descripcionMin) {
    errores.push("Contanos un poco más en la descripción.");
  }
  if (d.length > LIMITES.descripcionMax) {
    errores.push(`La descripción puede tener hasta ${LIMITES.descripcionMax} caracteres.`);
  }
  return errores;
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Fecha de la API (ISO) → "27 nov 2026", en hora local. */
export function fechaDePropuesta(iso: string | null): string {
  if (!iso) return "";
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "";
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;
}

/** Cuántas hay en cada estado, para los filtros. */
export function contarPorEstado(
  propuestas: Pick<Propuesta, "estado">[]
): Record<EstadoPropuesta, number> {
  const cuenta: Record<EstadoPropuesta, number> = {
    pendiente: 0,
    en_curso: 0,
    hecha: 0,
    descartada: 0,
  };
  for (const p of propuestas) if (p.estado in cuenta) cuenta[p.estado] += 1;
  return cuenta;
}
