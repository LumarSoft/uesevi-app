export interface IEmpleado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cuil: string;
  created: string;
  empresa_id: number;
  nombre_empresa: string;
  sindicato_activo: number;
  telefono?: string;
  domicilio?: string;
}
