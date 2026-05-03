export type EstadoContrato = "ACTIVO" | "VENCIDO" | "COMPLETADO" | "PENDIENTE";
export type EstadoReserva = "PENDIENTE" | "CONFIRMADA" | "CANCELADA";
export type EstadoDevolucion = "COMPLETADO" | "PENDIENTE";
export type EstadoMantenimiento = "PROGRAMADO" | "EN_PROCESO" | "COMPLETADO";

export interface Contrato {
  id: number;
  idCliente: number;
  nombreCliente: string;
  idVehiculo: number;
  placa: string;
  fechaInicio: string;
  fechaFin: string;
  valorDiario: number;
  estado: EstadoContrato;
}

export interface Reserva {
  id: string;
  idCliente: number;
  nombreCliente: string;
  idVehiculo: number;
  placa: string;
  fechaReserva: string;
  fechaInicio: string;
  estado: EstadoReserva;
}

export interface Devolucion {
  id: string;
  idContrato: number;
  placa: string;
  fechaDevolucion: string;
  kmDevolucion: number;
  estado: EstadoDevolucion;
}

export interface Mantenimiento {
  id: string;
  idVehiculo: number;
  placa: string;
  tipo: string;
  descripcion: string;
  fechaProgramada: string;
  estado: EstadoMantenimiento;
}

export interface EstadoGestion {
  contratos: Contrato[];
  reservas: Reserva[];
  devoluciones: Devolucion[];
  mantenimientos: Mantenimiento[];
}
