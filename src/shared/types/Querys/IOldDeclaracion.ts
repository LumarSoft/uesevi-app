export interface IOldDeclaracion {
  id: number;
  id_viejo: null;
  fecha: Date;
  old_empresa_id: number;
  rectificada: number;
  mes: number;
  year: number;
  importe: string;
  sueldo_basico: number;
  created: Date;
  modified: Date;
  nombre_empresa: string;
  cuit_empresa: string;
  empresa_id?: number;
}
