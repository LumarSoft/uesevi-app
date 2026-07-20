/**
 * Cálculo del aporte solidario (UESEVI).
 *
 * Regla vigente: el aporte solidario lo pagan SOLO los NO afiliados y es el
 * 2% FIJO del sueldo básico de la CATEGORÍA del empleado (tomado del sistema,
 * tabla `categorias`). NO depende del sueldo real del empleado, ni de
 * adicionales, ni de sumas no remunerativas.
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
 */
export function calcularAporteSolidario(
  esAfiliado: boolean,
  sueldoBasicoCategoria: number | string
): number {
  if (esAfiliado) return 0;
  return (Number(sueldoBasicoCategoria) || 0) * APORTE_SOLIDARIO_PCT;
}

// ============================================================================
// ⚠️ FÓRMULA DEL APORTE SOLIDARIO VERSIONADA POR PERÍODO — NO UNIFICAR ⚠️
// ----------------------------------------------------------------------------
// El aporte solidario CAMBIÓ DE FÓRMULA a partir de las declaraciones del
// período JULIO 2026. Este corte por fecha es DELIBERADO y debe conservarse:
// sirve para que las declaraciones VIEJAS sigan mostrando, por empleado, lo que
// realmente se declaró en su momento (y que coincida con la tabla `auxiliar`).
//
//   • DESDE julio 2026  (year > 2026, o year === 2026 && mes >= 7):
//       fórmula NUEVA → 2% del SUELDO BÁSICO DE LA CATEGORÍA (fijo por categoría).
//   • ANTES de julio 2026:
//       fórmula VIEJA → 2% de (sueldo real del empleado + suma no remunerativa +
//       remunerativo adicional). OJO: NO incluye el campo "adicional".
//
// Si alguien "simplifica" esto y deja una sola rama, las DDJJ anteriores a julio
// 2026 van a volver a mostrar montos por empleado distintos a los declarados.
// Contexto completo: docs/Analisis_Consultas_Cliente_Julio2026.md.
//
// Las pantallas de CARGA y RECTIFICACIÓN NO deben usar esta función: siempre
// generan una declaración nueva, así que aplican la fórmula vigente
// (calcularAporteSolidario). Esto es SÓLO para mostrar declaraciones existentes.
// ============================================================================
export const SOLIDARIO_NUEVA_FORMULA_DESDE = { year: 2026, mes: 7 } as const;

/** true si el período (mes/año) usa la fórmula nueva (básico de categoría). */
export function usaFormulaNuevaSolidario(mes: number, year: number): boolean {
  const { year: y0, mes: m0 } = SOLIDARIO_NUEVA_FORMULA_DESDE;
  return year > y0 || (year === y0 && mes >= m0);
}

export interface AporteSolidarioPorPeriodoInput {
  esAfiliado: boolean;
  mes: number;
  year: number;
  /** Sueldo básico de la categoría (fórmula NUEVA, desde julio 2026). */
  sueldoBasicoCategoria: number | string;
  /** Sueldo real del empleado — `monto` (fórmula VIEJA, hasta junio 2026). */
  monto: number | string;
  /** Suma no remunerativa (fórmula VIEJA). */
  sumaNoRemunerativa: number | string;
  /** Remunerativo adicional (fórmula VIEJA). */
  remunerativoAdicional: number | string;
}

/**
 * Aporte solidario de un empleado respetando la fórmula VIGENTE AL PERÍODO de la
 * declaración. Usar en la visualización de declaraciones ya cargadas (detalle
 * admin, PDF) para que lo histórico no cambie. Ver el bloque de arriba.
 */
export function calcularAporteSolidarioPorPeriodo(
  i: AporteSolidarioPorPeriodoInput
): number {
  if (i.esAfiliado) return 0;
  if (usaFormulaNuevaSolidario(i.mes, i.year)) {
    // NUEVA (desde julio 2026): 2% del básico de la categoría.
    return (Number(i.sueldoBasicoCategoria) || 0) * APORTE_SOLIDARIO_PCT;
  }
  // VIEJA (hasta junio 2026): 2% de (sueldo real + no remunerativa + rem. adicional).
  const base =
    (Number(i.monto) || 0) +
    (Number(i.sumaNoRemunerativa) || 0) +
    (Number(i.remunerativoAdicional) || 0);
  return base * APORTE_SOLIDARIO_PCT;
}
