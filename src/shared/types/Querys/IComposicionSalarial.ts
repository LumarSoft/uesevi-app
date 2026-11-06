export interface IConceptoSalarial {
  nombre: string;
  monto: number;
}

// Composición del salario de referencia de un período (lo carga el admin y lo
// ve el público en la home, sección "Salario del mes").
export interface IComposicionSalarial {
  id: number;
  year: number;
  mes: number; // 1..12
  categoria: string;
  conceptos: IConceptoSalarial[];
  nota: string | null;
  total: number; // lo calcula la API sumando los montos
  publicado?: number; // 1 visible, 0 borrador (solo lo devuelve el endpoint admin)
  created?: string;
  modified?: string;
}
