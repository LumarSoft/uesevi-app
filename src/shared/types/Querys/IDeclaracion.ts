export interface IDeclaracion {
  id: number;
  id_viejo?: number;
  fecha: Date;
  empresa_id: number;
  rectificada: number;
  mes: number;
  year: number;
  subtotal: string | null;
  interes?: string | null;
  importe: string;
  vencimiento?: null;
  fecha_pago?: string | null;
  estado?: number | null;
  pago_parcial?: null;
  sueldo_basico: number;
  created: Date;
  modified: Date;
  nombre_empresa: string;
  cuit_empresa: string;
}
