export interface IOldInfoDeclaracion {
  year: number;
  mes: number;
  empleados: Empleado[];
}

export interface Empleado {
  nombre_completo: string;
  afiliado: string;
  cuil: string;
  monto: number;
  categoria: string;
  sueldo_basico_categoria: string;
  adicional: string;
  total_bruto: number;
}
