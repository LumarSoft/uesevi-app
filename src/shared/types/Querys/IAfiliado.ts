// Fila de GET /employees/affiliates: un afiliado vigente (mismo criterio que la
// tarjeta "Empleados afiliados" del dashboard).
export interface IAfiliado {
  empleado_id: number;
  /** usuarios.id */
  id: number;
  apellido: string;
  nombre: string;
  /** 11 dígitos, sin guiones. */
  cuil: string;
  categoria_id: number | null;
  categoria: string;
  empresa_id: number | null;
  nombre_empresa: string;
}
