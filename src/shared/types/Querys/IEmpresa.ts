export interface IEmpresa {
  id: number;
  id_viejo: number;
  usuario_id: number;
  cuit: string;
  nombre: string;
  domicilio: string;
  telefono: string;
  ciudad: string;
  numero_agencia: number;
  estado: string;
  email_contacto: string;
  categoria: number;
  created: Date;
  modified: Date;
}
