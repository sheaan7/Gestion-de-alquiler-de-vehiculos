export interface Cliente {
  id: number;
  nombre: string;
  cedulaNit: string;
  telefono: string;
  email: string;
  direccion: string;
  licencia: string;
  tipoCliente: string;
  activo: boolean;
}

export interface ClienteInput {
  nombre: string;
  cedulaNit: string;
  telefono: string;
  email: string;
  direccion: string;
  licencia: string;
  tipoCliente: string;
  activo: boolean;
}

export const TIPOS_CLIENTE = ["Particular", "Empresarial", "Frecuente"] as const;
export type TipoCliente = (typeof TIPOS_CLIENTE)[number];
