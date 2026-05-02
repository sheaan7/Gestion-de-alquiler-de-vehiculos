import { Operacion, Vehiculo } from "../types/vehiculo";

const urlGateway = process.env.NEXT_PUBLIC_URL_GATEWAY ?? "http://localhost:8080";

export async function listarVehiculos(): Promise<Vehiculo[]> {
  const respuesta = await fetch(`${urlGateway}/api/vehiculos`, { cache: "no-store" });
  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar los vehiculos");
  }
  return respuesta.json();
}

export async function alquilarVehiculo(idVehiculo: number): Promise<Operacion> {
  const respuesta = await fetch(`${urlGateway}/api/operaciones/alquiler`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idVehiculo })
  });
  if (!respuesta.ok) {
    throw new Error("No se pudo confirmar el alquiler");
  }
  return respuesta.json();
}

export async function listarOperaciones(): Promise<Operacion[]> {
  const respuesta = await fetch(`${urlGateway}/api/operaciones`, { cache: "no-store" });
  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las operaciones");
  }
  return respuesta.json();
}

export async function cancelarOperacion(idOperacion: string): Promise<Operacion> {
  const respuesta = await fetch(`${urlGateway}/api/operaciones/${idOperacion}/cancelar`, {
    method: "POST"
  });
  if (!respuesta.ok) {
    throw new Error("No se pudo cancelar la operacion");
  }
  return respuesta.json();
}
