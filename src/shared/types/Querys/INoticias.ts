export interface INoticias {
  id: number;
  titulo: string;
  epigrafe: string;
  cuerpo: string;
  created: Date;
  modified: Date;
  principal?: number;
  archivo?: string;
  portada?: string;
  destinatario?: string;
  cuerpo_secundario?: string;
  images?: any[];
  url?: string;
}
