export type EstadoVehiculo = "DISPONIBLE" | "NO_DISPONIBLE";

export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  estado: EstadoVehiculo;
}

export interface Operacion {
  idOperacion: string;
  idVehiculo: number;
  estado: "CONFIRMADA" | "CANCELADA";
}
