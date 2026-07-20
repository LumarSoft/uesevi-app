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
  remunerativo_adicional: string;
  suma_no_remunerativa: string;
  categoria: string;
  adicional: string;
  total_bruto: number;
  monto: string;
}
