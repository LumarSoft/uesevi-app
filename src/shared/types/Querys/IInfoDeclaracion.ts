export interface IInfoDeclaracion {
  nombre_empresa:                 string;
  cantidad_empleados_declaracion: number;
  cantidad_afiliados_declaracion: number;
  year:                           number;
  mes:                            number;
  rectificada:                    number;
  vencimiento:                    string;
  fecha_pago:                     string;
  empleados:                      Empleado[];
}

export interface Empleado {
  nombre_completo:        string;
  afiliado:               string;
  cuil:                   string;
  sueldo_basico:          number;
  remunerativo_adicional: string;
  suma_no_remunerativa:   string;
  categoria:              string;
  adicional:              string;
  total_bruto:            number;
}