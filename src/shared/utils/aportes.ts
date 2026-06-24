export const APORTE_SOLIDARIO_PCT = 0.02;

/** sueldoBasicoCategoria: sueldo_basico de la categoría tomado del SISTEMA (nunca del Excel). */
export function calcularAporteSolidario(
  esAfiliado: boolean,
  sueldoBasicoCategoria: number
): number {
  if (esAfiliado) return 0;
  return (Number(sueldoBasicoCategoria) || 0) * APORTE_SOLIDARIO_PCT;
}
