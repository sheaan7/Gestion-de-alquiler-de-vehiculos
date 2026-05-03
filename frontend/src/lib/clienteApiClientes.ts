import { Cliente, ClienteInput } from "../types/cliente";

export async function listarClientes(): Promise<Cliente[]> {
  const res = await fetch("/api/clientes", { cache: "no-store" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudieron cargar los clientes");
  return res.json();
}

export async function obtenerCliente(id: number): Promise<Cliente> {
  const res = await fetch(`/api/clientes/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error((await res.text()) || "No se encontró el cliente");
  return res.json();
}

export async function crearCliente(input: ClienteInput): Promise<Cliente> {
  const res = await fetch("/api/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo crear el cliente");
  return res.json();
}

export async function actualizarCliente(id: number, input: ClienteInput): Promise<Cliente> {
  const res = await fetch(`/api/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo actualizar el cliente");
  return res.json();
}

export async function eliminarCliente(id: number): Promise<void> {
  const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo eliminar el cliente");
}

export async function buscarClientes(q: string): Promise<Cliente[]> {
  const res = await fetch(`/api/clientes/buscar?q=${encodeURIComponent(q)}`, { cache: "no-store" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo buscar clientes");
  return res.json();
}
