import { Contrato } from "./clienteApiContratos";

export interface Reserva {
  id: number;
  idCliente: number;
  nombreCliente: string;
  idVehiculo: number;
  placa: string;
  fechaReserva: string;
  fechaInicio: string;
  estado: "PENDIENTE" | "CONFIRMADA" | "CANCELADA";
}

export interface ReservaCreate {
  idCliente: number;
  nombreCliente: string;
  idVehiculo: number;
  placa: string;
  fechaReserva: string;
  fechaInicio: string;
  estado?: string;
}

export async function listReservas(): Promise<Reserva[]> {
  const res = await fetch("/api/reservas", { cache: "no-store" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudieron cargar las reservas");
  return res.json();
}

export async function createReserva(data: ReservaCreate): Promise<Reserva> {
  const res = await fetch("/api/reservas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo crear la reserva");
  return res.json();
}

export async function confirmarReserva(
  id: number,
  body: { fechaFin: string; valorDiario: number }
): Promise<Contrato> {
  const res = await fetch(`/api/reservas/${id}/confirmar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo confirmar la reserva");
  return res.json();
}

export async function cancelarReserva(id: number): Promise<Reserva> {
  const res = await fetch(`/api/reservas/${id}/cancelar`, { method: "POST" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo cancelar la reserva");
  return res.json();
}

export async function deleteReserva(id: number): Promise<void> {
  const res = await fetch(`/api/reservas/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo eliminar la reserva");
}
