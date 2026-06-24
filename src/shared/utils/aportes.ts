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
