export interface ICategoria {
  id: number;
  nombre: string;
  created: Date;
  modified: Date;
  sueldo_basico: string;
  sueldo_futuro: null | string;
  fecha_vigencia: null | string;
}
