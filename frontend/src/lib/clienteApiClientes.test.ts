import { afterEach, describe, expect, it, vi } from "vitest";
import {
  listarClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  buscarClientes,
} from "./clienteApiClientes";

describe("clienteApiClientes", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("lista clientes por /api/clientes", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    await listarClientes();
    expect(fetchMock).toHaveBeenCalledWith("/api/clientes", { cache: "no-store" });
  });

  it("crea un cliente con POST", async () => {
    const cliente = { id: 1, nombre: "Juan", cedulaNit: "123", telefono: "300", email: "j@j.com", direccion: "", licencia: "B1", tipoCliente: "Particular", activo: true };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => cliente });
    vi.stubGlobal("fetch", fetchMock);
    const input = { nombre: "Juan", cedulaNit: "123", telefono: "300", email: "j@j.com", direccion: "", licencia: "B1", tipoCliente: "Particular", activo: true };
    const resultado = await crearCliente(input);
    expect(resultado).toEqual(cliente);
    expect(fetchMock).toHaveBeenCalledWith("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  });

  it("actualiza un cliente con PUT", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    const input = { nombre: "Juan", cedulaNit: "123", telefono: "300", email: "j@j.com", direccion: "", licencia: "B1", tipoCliente: "Particular", activo: true };
    await actualizarCliente(5, input);
    expect(fetchMock).toHaveBeenCalledWith("/api/clientes/5", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  });

  it("elimina un cliente con DELETE", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);
    await eliminarCliente(3);
    expect(fetchMock).toHaveBeenCalledWith("/api/clientes/3", { method: "DELETE" });
  });

  it("busca clientes por término", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    await buscarClientes("María");
    expect(fetchMock).toHaveBeenCalledWith("/api/clientes/buscar?q=Mar%C3%ADa", { cache: "no-store" });
  });

  it("lanza error descriptivo al fallar la creación", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);
    await expect(crearCliente({ nombre: "A", cedulaNit: "B", telefono: "C", email: "d@d.com", direccion: "", licencia: "", tipoCliente: "Particular", activo: true }))
      .rejects.toThrow("No se pudo crear el cliente");
  });
});
