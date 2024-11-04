export interface IEmpleado {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  cuil: string;
  empleado_id: number;
  created: string;
  empresa_id: number;
  nombre_empresa: string;
  sindicato_activo: number;
  telefono?: string;
  domicilio?: string;
  categoria_id?: number;
  estado: string;
}
