export interface IInfoDeclaracion {
  id: number;
  nombre_empresa: string;
  cantidad_empleados_declaracion: number;
  cantidad_afiliados_declaracion: number;
  year: number;
  mes: number;
  /**
   * `declaraciones_juradas.fecha` — cuándo se CARGÓ la declaración. Determina
   * qué fórmula del aporte solidario aplica al mostrarla. NO usar mes/year para
   * eso: el período no dice cuándo se cargó (ver shared/utils/aportes.ts).
   */
  fecha_carga: string | null;
  rectificada: number;
  vencimiento: string;
  fecha_pago: string | null;
  sueldo_basico: number;
  pago_parcial: string | null;
  empleados: Empleado[];
  estado: number;
  ajuste: number;
  importe: number;
  subtotal: number;
  // Desglose CONGELADO (snapshot) desde la tabla auxiliar al momento de cargar
  // la declaración. Fuente de verdad del desglose por concepto. null en
  // declaraciones legacy sin auxiliar (el front cae al cálculo tradicional).
  desglose?: {
    fas: number;
    solidario: number;
    sindical: number;
    total: number;
  } | null;
}

export interface Empleado {
  nombre_completo: string;
  afiliado: string;
  cuil: string;
  sueldo_basico: number;
  /**
   * Presentismo de la categoría CONGELADO al cargar la declaración. Llega en 0
   * en las declaraciones anteriores a agosto 2026 (no existía el concepto).
   * Junto con sueldo_basico es la base del aporte solidario.
   */
  presentismo: number;
  remunerativo_adicional: string;
  suma_no_remunerativa: string;
  categoria: string;
  adicional: string;
  total_bruto: number;
  monto: string;
}
