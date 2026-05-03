export interface Contrato {
  id: number;
  idCliente: number;
  nombreCliente: string;
  idVehiculo: number;
  placa: string;
  fechaInicio: string;
  fechaFin: string;
  valorDiario: number;
  estado: "PENDIENTE" | "ACTIVO" | "COMPLETADO" | "VENCIDO";
}

export interface ContratoCreate {
  idCliente: number;
  nombreCliente: string;
  idVehiculo: number;
  placa: string;
  fechaInicio: string;
  fechaFin: string;
  valorDiario: number;
  estado?: string;
}

export async function listContratos(): Promise<Contrato[]> {
  const res = await fetch("/api/contratos", { cache: "no-store" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudieron cargar los contratos");
  return res.json();
}

export async function createContrato(data: ContratoCreate): Promise<Contrato> {
  const res = await fetch("/api/contratos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo crear el contrato");
  return res.json();
}

export async function getContrato(id: number): Promise<Contrato> {
  const res = await fetch(`/api/contratos/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error((await res.text()) || "No se encontró el contrato");
  return res.json();
}

export async function updateContrato(id: number, data: ContratoCreate): Promise<Contrato> {
  const res = await fetch(`/api/contratos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo actualizar el contrato");
  return res.json();
}

export async function deleteContrato(id: number): Promise<void> {
  const res = await fetch(`/api/contratos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo eliminar el contrato");
}
