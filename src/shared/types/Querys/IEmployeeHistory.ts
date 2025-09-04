export interface IContrato {
  contrato_id: number;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado_contrato: string;
  ultima_modificacion: string;
  estado_descripcion: 'Activo' | 'Finalizado' | 'Inactivo';
}

export interface IEmployeeHistory {
  empresa_id: number;
  nombre_empresa: string;
  cuit_empresa: string;
  estado_empresa: string;
  nombre: string;
  apellido: string;
  cuil: string;
  categoria: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado_descripcion: 'Activo' | 'Finalizado' | 'Inactivo';
  total_contratos: number;
  contratos: IContrato[];
}
