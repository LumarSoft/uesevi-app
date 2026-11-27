// Vencimiento e intereses de una DDJJ, compartido por la vista del admin y la
// de la empresa (pantalla y PDF). Sin imports en tiempo de ejecución: lo
// prueba test/vencimientoDeclaracion.test.mjs importando este .ts directo.

const MS_POR_DIA = 1000 * 60 * 60 * 24;

/** `declaraciones_juradas.estado`: 1 es Aprobado/Pagado. */
export const ESTADO_APROBADA = 1;

export interface DeclaracionConVencimiento {
  estado: number;
  vencimiento: string;
  fecha_pago: string | null;
}

/**
 * Días de atraso sobre los que se cobra interés. La cuenta es la de siempre
 * (fecha de pago − vencimiento, o hoy − vencimiento si no hay pago) y la
 * fórmula del interés no cambia: cada pantalla sigue haciendo
 * `total × tasa × días / 100` cuando esto da más que 0.
 *
 * Única excepción: una DDJJ aprobada sin fecha de pago devuelve 0. Ya está
 * saldada, y contar hasta hoy hacía que su "Total a pagar" subiera todos los
 * días debajo del "✓ Aprobado". Es el mismo criterio que ya usaba el cartel de
 * vencimiento de esa pantalla para los días de atraso.
 */
export function diasDeAtrasoParaIntereses(
  declaracion: DeclaracionConVencimiento,
  hoy: Date = new Date()
): number {
  const vencimiento = new Date(declaracion.vencimiento);
  if (declaracion.fecha_pago) {
    return Math.floor(
      (new Date(declaracion.fecha_pago).getTime() - vencimiento.getTime()) /
        MS_POR_DIA
    );
  }
  if (declaracion.estado === ESTADO_APROBADA) return 0;
  return Math.floor((hoy.getTime() - vencimiento.getTime()) / MS_POR_DIA);
}

export type SituacionVencimiento =
  | { tipo: "aprobada" }
  | { tipo: "pagada_a_tiempo" }
  | { tipo: "vencida"; dias: number }
  // Todavía no venció y no tiene pago: antes caía en "Vencida: 0 días" en
  // rojo, justo lo que veía cada empresa al terminar de cargar.
  | { tipo: "en_termino"; diasRestantes: number };

/** Días de calendario (hora local) entre dos fechas, sin contar la hora. */
const diasDeCalendario = (desde: Date, hasta: Date) => {
  const inicio = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate());
  const fin = new Date(hasta.getFullYear(), hasta.getMonth(), hasta.getDate());
  return Math.round((fin.getTime() - inicio.getTime()) / MS_POR_DIA);
};

/** Qué cartel mostrar al lado del vencimiento. */
export function situacionVencimiento(
  declaracion: DeclaracionConVencimiento,
  hoy: Date = new Date()
): SituacionVencimiento {
  if (declaracion.estado === ESTADO_APROBADA) return { tipo: "aprobada" };

  const vencimiento = new Date(declaracion.vencimiento);
  if (declaracion.fecha_pago) {
    const pago = new Date(declaracion.fecha_pago);
    if (pago <= vencimiento) return { tipo: "pagada_a_tiempo" };
    return {
      tipo: "vencida",
      dias: Math.floor((pago.getTime() - vencimiento.getTime()) / MS_POR_DIA),
    };
  }

  // Por día de calendario: el día del vencimiento todavía está en término
  // (la API lo guarda como fecha sin hora, y ese día no corre interés).
  const diasRestantes = diasDeCalendario(hoy, vencimiento);
  if (diasRestantes >= 0) return { tipo: "en_termino", diasRestantes };
  return {
    tipo: "vencida",
    dias: Math.floor((hoy.getTime() - vencimiento.getTime()) / MS_POR_DIA),
  };
}

/** Texto del cartel; `null` para los dos estados en verde, que arma la vista. */
export function textoVencimiento(situacion: SituacionVencimiento): string | null {
  switch (situacion.tipo) {
    case "vencida":
      return situacion.dias > 0 ? `Vencida: ${situacion.dias} días` : "Vencida";
    case "en_termino":
      if (situacion.diasRestantes <= 0) return "Vence hoy";
      if (situacion.diasRestantes === 1) return "Vence mañana";
      return `Faltan ${situacion.diasRestantes} días`;
    default:
      return null;
  }
}
