export interface ICategoria {
  id: number;
  nombre: string;
  created: Date;
  modified: Date;
  sueldo_basico: string;
  sueldo_futuro: null | string;
  fecha_vigencia: null | string;
  // Presentismo de la categoría. Junto con el sueldo básico forma la base del
  // aporte solidario (2% de la suma). null = todavía no cargado => cuenta 0.
  presentismo: null | string;
  presentismo_futuro: null | string;
  fecha_vigencia_presentismo: null | string;
  // Las mismas fechas en `yyyy-MM-dd`, para precargar los <input type="date">
  // del diálogo Programar. Las de arriba vienen en "dd/MM/yy HH:mm" (formato de
  // tabla) y un input date las ignora, dejando el campo vacío.
  fecha_vigencia_input: null | string;
  fecha_vigencia_presentismo_input: null | string;
}
