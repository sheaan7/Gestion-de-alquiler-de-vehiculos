import { Operacion, Vehiculo } from "../types/vehiculo";

export async function listarVehiculos(): Promise<Vehiculo[]> {
  const respuesta = await fetch("/api/vehiculos", { cache: "no-store" });
  if (!respuesta.ok) {
    const msg = await respuesta.text();
    throw new Error(msg || "No se pudieron cargar los vehiculos");
  }
  return respuesta.json();
}

export async function alquilarVehiculo(idVehiculo: number): Promise<Operacion> {
  const respuesta = await fetch("/api/operaciones/alquiler", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idVehiculo })
  });
  if (!respuesta.ok) {
    const msg = await respuesta.text();
    throw new Error(msg || "No se pudo confirmar el alquiler");
  }
  return respuesta.json();
}

export async function listarOperaciones(): Promise<Operacion[]> {
  const respuesta = await fetch("/api/operaciones", { cache: "no-store" });
  if (!respuesta.ok) {
    const msg = await respuesta.text();
    throw new Error(msg || "No se pudieron cargar las operaciones");
  }
  return respuesta.json();
}

export async function cancelarOperacion(idOperacion: string): Promise<void> {
  const respuesta = await fetch(`/api/operaciones/${idOperacion}/cancelar`, {
    method: "POST"
  });
  if (!respuesta.ok) {
    const msg = await respuesta.text();
    throw new Error(msg || "No se pudo cancelar la operacion");
  }
}
