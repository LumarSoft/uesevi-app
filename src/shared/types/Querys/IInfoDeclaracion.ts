export interface IInfoDeclaracion {
  id: number;
  nombre_empresa: string;
  cantidad_empleados_declaracion: number;
  cantidad_afiliados_declaracion: number;
  year: number;
  mes: number;
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
  // Desglose persistido en la tabla `auxiliar` al presentar/rectificar la DDJJ
  // (misma fuente que el Panel de Pagos). Null en declaraciones legacy.
  desglose_fas?: number | string | null;
  desglose_solidario?: number | string | null;
  desglose_sindical?: number | string | null;
  desglose_total?: number | string | null;
}

export interface Empleado {
  nombre_completo: string;
  afiliado: string;
  cuil: string;
  sueldo_basico: number;
  remunerativo_adicional: string;
  suma_no_remunerativa: string;
  categoria: string;
  adicional: string;
  total_bruto: number;
  monto: string;
}
