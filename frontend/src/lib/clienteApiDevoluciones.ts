export interface Devolucion {
  id: number;
  idContrato: number;
  placa: string;
  fechaDevolucion: string;
  kmDevolucion: number;
  estado: "PENDIENTE" | "COMPLETADO";
}

export async function listDevoluciones(): Promise<Devolucion[]> {
  const res = await fetch("/api/devoluciones", { cache: "no-store" });
  if (!res.ok) throw new Error((await res.text()) || "No se pudieron cargar las devoluciones");
  return res.json();
}

export async function registrarDevolucion(data: {
  idContrato: number;
  kmDevolucion: number;
}): Promise<Devolucion> {
  const res = await fetch("/api/devoluciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.text()) || "No se pudo registrar la devolución");
  return res.json();
}
