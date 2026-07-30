/**
 * Cálculo del aporte solidario (UESEVI).
 *
 * Regla vigente: el aporte solidario lo pagan SOLO los NO afiliados y es el
 * 2% FIJO de (sueldo básico + presentismo) de la CATEGORÍA del empleado, ambos
 * montos tomados del sistema (tabla `categorias`). NO depende del sueldo real
 * del empleado, ni de adicionales, ni de sumas no remunerativas, ni de nada que
 * declare la empresa: por eso el presentismo se configura en Admin → Categorías
 * y NO viene en el Excel de la declaración.
 *
 * Es estático por categoría: todos los no afiliados de la misma categoría
 * aportan lo mismo, y solo cambia si cambia la categoría.
 *
 * NO confundir con el aporte sindical (3%, afiliados) ni con el FAS (1%), que
 * siguen calculándose sobre la base del empleado.
 */
export const APORTE_SOLIDARIO_PCT = 0.02;

/**
 * @param esAfiliado true si el empleado está adherido al sindicato.
 * @param sueldoBasicoCategoria sueldo_basico de la categoría tomado del sistema.
 * @param presentismoCategoria presentismo de la categoría. Si la categoría no
 *   tiene monto cargado (NULL) entra como 0 y el aporte queda igual que antes
 *   del cambio de agosto 2026.
 */
export function calcularAporteSolidario(
  esAfiliado: boolean,
  sueldoBasicoCategoria: number | string,
  presentismoCategoria: number | string = 0
): number {
  if (esAfiliado) return 0;
  const base =
    (Number(sueldoBasicoCategoria) || 0) + (Number(presentismoCategoria) || 0);
  return base * APORTE_SOLIDARIO_PCT;
}

// ============================================================================
// ⚠️ FÓRMULA DEL APORTE SOLIDARIO VERSIONADA POR FECHA DE CARGA — NO UNIFICAR ⚠️
// ----------------------------------------------------------------------------
// El aporte solidario cambió de fórmula el 30/06/2026 (merge del PR #12,
// commit 70b674c). Lo que determina qué fórmula aplica es CUÁNDO SE CARGÓ la
// declaración, NO a qué período corresponde:
//
//   • Cargada DESDE el 01/07/2026:
//       2% de (SUELDO BÁSICO + PRESENTISMO) DE LA CATEGORÍA — ambos congelados
//       en la fila de `sueldos`. Fijo por categoría; no depende de lo que la
//       empresa declare en el Excel.
//   • Cargada ANTES del 01/07/2026:
//       2% de (sueldo REAL del empleado + suma no remunerativa + remunerativo
//       adicional). OJO: no incluye el campo "adicional".
//
// 🚩 POR QUÉ POR FECHA DE CARGA Y NO POR PERÍODO
// La versión anterior de este archivo versionaba por el PERÍODO (mes/year) de la
// declaración, asumiendo que el período coincide con el momento de la carga. Es
// falso, y rompía en un caso real: una DDJJ del período JUNIO 2026 cargada el
// 30/07/2026 se guarda con la fórmula NUEVA, pero al mostrarla se le aplicaba la
// VIEJA por ser junio. Resultado: el detalle por empleado no sumaba el total.
//     auxiliar.solidario (lo declarado) = 51.986,00
//     suma de las filas por empleado    = 28.451,20
// Pasa con cualquier presentación tardía o rectificación. La fecha de carga
// (`declaraciones_juradas.fecha`, que se setea en NOW() al insertar) es el único
// dato que dice qué fórmula estaba viva en ese momento.
//
// ℹ️ EL PRESENTISMO (agosto 2026) NO NECESITA OTRO CORTE.
// Se resuelve con el snapshot `sueldos.presentismo`, congelado al cargar:
//   • DDJJ cargadas antes de agosto → presentismo NULL → el backend devuelve 0
//     → 2% × (básico + 0) = exactamente lo que mostraban. No se mueven.
//   • DDJJ nuevas → presentismo congelado → si después cambia el monto de la
//     categoría, lo histórico sigue mostrando lo declarado.
// Si alguien lee el presentismo VIGENTE de `categorias` en vez del congelado de
// `sueldos`, vuelven los montos que cambian solos.
//
// ⚠️ `sueldos.sueldo_basico` guarda el básico DE LA CATEGORÍA (siempre lo hizo,
// verificado en git). El sueldo del Excel va en `monto`. No confundirlos: el
// aporte solidario NO se calcula sobre lo que declara la empresa.
//
// Si alguien "simplifica" esto y deja una sola rama, las DDJJ cargadas antes del
// 01/07/2026 van a mostrar montos por empleado distintos a los declarados.
// Contexto completo: docs/Analisis_Consultas_Cliente_Julio2026.md.
//
// Las pantallas de CARGA y RECTIFICACIÓN NO usan esta función: siempre generan
// una declaración nueva, así que aplican la fórmula vigente
// (calcularAporteSolidario). Esto es SÓLO para mostrar declaraciones existentes.
// ============================================================================

/** Fecha del deploy que cambió la fórmula (merge PR #12, 30/06/2026). */
export const SOLIDARIO_NUEVA_FORMULA_DESDE = "2026-07-01T00:00:00" as const;

/**
 * true si la declaración se cargó con la fórmula nueva (básico de categoría).
 * @param fechaCarga `declaraciones_juradas.fecha`. Si falta, se asume fórmula
 *   nueva: es lo vigente y lo correcto para todo lo que se cargue de ahora en más.
 */
export function usaFormulaNuevaSolidario(
  fechaCarga: string | Date | null | undefined
): boolean {
  if (!fechaCarga) return true;
  const t = new Date(fechaCarga).getTime();
  if (Number.isNaN(t)) return true;
  return t >= new Date(SOLIDARIO_NUEVA_FORMULA_DESDE).getTime();
}

export interface AporteSolidarioPorPeriodoInput {
  esAfiliado: boolean;
  /** `declaraciones_juradas.fecha` — cuándo se CARGÓ la declaración. */
  fechaCarga: string | Date | null | undefined;
  /** Sueldo básico DE LA CATEGORÍA, congelado en `sueldos.sueldo_basico`. */
  sueldoBasicoCategoria: number | string;
  /** Presentismo DE LA CATEGORÍA, congelado en `sueldos.presentismo`. */
  presentismoCategoria?: number | string;
  /** Sueldo real del empleado — `sueldos.monto` (sólo fórmula VIEJA). */
  monto: number | string;
  /** Suma no remunerativa (sólo fórmula VIEJA). */
  sumaNoRemunerativa: number | string;
  /** Remunerativo adicional (sólo fórmula VIEJA). */
  remunerativoAdicional: number | string;
}

/**
 * Aporte solidario de un empleado, con la fórmula que estaba vigente CUANDO SE
 * CARGÓ la declaración. Usar en toda vista de declaraciones ya cargadas: tabla,
 * totales y PDF, tanto de admin como de empresa.
 */
export function calcularAporteSolidarioPorPeriodo(
  i: AporteSolidarioPorPeriodoInput
): number {
  if (i.esAfiliado) return 0;
  if (usaFormulaNuevaSolidario(i.fechaCarga)) {
    // NUEVA: 2% de (básico + presentismo) de la CATEGORÍA, ambos congelados.
    return calcularAporteSolidario(
      false,
      i.sueldoBasicoCategoria,
      i.presentismoCategoria ?? 0
    );
  }
  // VIEJA: 2% de (sueldo real + no remunerativa + rem. adicional).
  const base =
    (Number(i.monto) || 0) +
    (Number(i.sumaNoRemunerativa) || 0) +
    (Number(i.remunerativoAdicional) || 0);
  return base * APORTE_SOLIDARIO_PCT;
}
