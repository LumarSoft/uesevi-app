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
  vencimiento: string;
  fecha_pago?: string | null;
  estado?: number | null;
  es_version_anterior?: number;
  pago_parcial?: null;
  sueldo_basico: number;
  created: Date;
  modified: Date;
  nombre_empresa: string;
  cuit_empresa: string;
}
