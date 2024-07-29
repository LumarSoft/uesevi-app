export interface IAdmin {
  id: number;
  id_viejo: number;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: string;
  estado: string;
  created: Date;
  modified: Date;
  telefono: string;
  deleted: null;
  olvido_password: string | null;
  hash: string | null;
  caducidad: Date | null;
}
