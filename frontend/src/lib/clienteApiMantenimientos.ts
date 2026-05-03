export interface Mantenimiento {
  id: number;
  idVehiculo: number;
  placa: string;
  tipo: string;
  descripcion: string;
  fechaProgramada: string;
  estado: "PROGRAMADO" | "EN_PROCESO" | "COMPLETADO";
}

export interface MantenimientoCreate {
  idVehiculo: number;
  placa: string;
  tipo: string;
  descripcion: string;
  fechaProgramada: string;
  estado?: string;
}

export async function listMantenimientos(): Promise<Mantenimiento[]> {
  const res = await fetch("/api/mantenimientos", { cache: "no-store" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudieron cargar los mantenimientos");
  return res.json();
}

export async function createMantenimiento(data: MantenimientoCreate): Promise<Mantenimiento> {
  const res = await fetch("/api/mantenimientos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo crear el mantenimiento");
  return res.json();
}

export async function updateMantenimiento(
  id: number,
  data: MantenimientoCreate
): Promise<Mantenimiento> {
  const res = await fetch(`/api/mantenimientos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo actualizar el mantenimiento");
  return res.json();
}

export async function completarMantenimiento(id: number): Promise<Mantenimiento> {
  const res = await fetch(`/api/mantenimientos/${id}/completar`, { method: "POST" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo completar el mantenimiento");
  return res.json();
}

export async function deleteMantenimiento(id: number): Promise<void> {
  const res = await fetch(`/api/mantenimientos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo eliminar el mantenimiento");
}
