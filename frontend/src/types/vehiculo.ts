export type EstadoVehiculo = "DISPONIBLE" | "NO_DISPONIBLE";
export type TipoVehiculo = "SUV" | "Sedán" | "Camioneta" | "Van" | "Compacto" | "Lujo";

export const TIPOS_VEHICULO: TipoVehiculo[] = [
  "SUV",
  "Sedán",
  "Camioneta",
  "Van",
  "Compacto",
  "Lujo",
];

export interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo: TipoVehiculo;
  km_actuales: number;
  estado: EstadoVehiculo;
}

export interface VehiculoInput {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  tipo: TipoVehiculo;
  km_actuales: number;
  estado: EstadoVehiculo;
}

export interface Operacion {
  idOperacion: string;
  idVehiculo: number;
  estado: "CONFIRMADA" | "CANCELADA";
}
