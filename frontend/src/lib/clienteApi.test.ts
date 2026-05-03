import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  actualizarVehiculo,
  crearVehiculo,
  eliminarVehiculo,
  listarVehiculos,
} from "./clienteApi";

describe("clienteApi", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("construye endpoint de vehiculos con URL relativa", async () => {
    const simuladorFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    });
    vi.stubGlobal("fetch", simuladorFetch);

    await listarVehiculos();

    expect(simuladorFetch).toHaveBeenCalledWith(
      "/api/vehiculos",
      { cache: "no-store" }
    );
  });

  it("crea un vehiculo con POST y devuelve el recurso creado", async () => {
    const creado = {
      id: 11,
      marca: "Mazda",
      modelo: "3",
      estado: "DISPONIBLE" as const,
    };
    const simuladorFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => creado,
    });
    vi.stubGlobal("fetch", simuladorFetch);

    const resultado = await crearVehiculo({
      placa: "MZD-001",
      marca: "Mazda",
      modelo: "3",
      anio: 2022,
      tipo: "Compacto",
      km_actuales: 0,
      estado: "DISPONIBLE",
    });

    expect(resultado).toEqual(creado);
    expect(simuladorFetch).toHaveBeenCalledWith("/api/vehiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placa: "MZD-001",
        marca: "Mazda",
        modelo: "3",
        anio: 2022,
        tipo: "Compacto",
        km_actuales: 0,
        estado: "DISPONIBLE",
      }),
    });
  });

  it("actualiza un vehiculo con PUT y devuelve el recurso actualizado", async () => {
    const actualizado = {
      id: 7,
      marca: "Kia",
      modelo: "Rio",
      estado: "NO_DISPONIBLE" as const,
    };
    const simuladorFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => actualizado,
    });
    vi.stubGlobal("fetch", simuladorFetch);

    const resultado = await actualizarVehiculo(7, {
      placa: "KIA-007",
      marca: "Kia",
      modelo: "Rio",
      anio: 2021,
      tipo: "Compacto",
      km_actuales: 15000,
      estado: "NO_DISPONIBLE",
    });

    expect(resultado).toEqual(actualizado);
    expect(simuladorFetch).toHaveBeenCalledWith("/api/vehiculos/7", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placa: "KIA-007",
        marca: "Kia",
        modelo: "Rio",
        anio: 2021,
        tipo: "Compacto",
        km_actuales: 15000,
        estado: "NO_DISPONIBLE",
      }),
    });
  });

  it("elimina un vehiculo con DELETE", async () => {
    const simuladorFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => "",
    });
    vi.stubGlobal("fetch", simuladorFetch);

    await eliminarVehiculo(5);

    expect(simuladorFetch).toHaveBeenCalledWith("/api/vehiculos/5", {
      method: "DELETE",
    });
  });

  it("lanza error descriptivo al fallar la creacion", async () => {
    const simuladorFetch = vi.fn().mockResolvedValue({
      ok: false,
      text: async () => "",
    });
    vi.stubGlobal("fetch", simuladorFetch);

    await expect(
      crearVehiculo({ placa: "TST-001", marca: "A", modelo: "B", anio: 2020, tipo: "Compacto", km_actuales: 0, estado: "DISPONIBLE" })
    ).rejects.toThrow("No se pudo crear el vehículo");
  });
});

describe("compose frontend", () => {
  it("define URL_GATEWAY en Dockerfile", () => {
    const rutaDockerfile = resolve(process.cwd(), "Dockerfile");
    const contenido = readFileSync(rutaDockerfile, "utf8");
    expect(contenido).toContain("ENV URL_GATEWAY=http://localhost:8080");
  });

  it("no define rewrites para /api en next.config.ts", () => {
    const rutaNextConfig = resolve(process.cwd(), "next.config.ts");
    const contenido = readFileSync(rutaNextConfig, "utf8");
    expect(contenido).not.toContain("rewrites()");
  });
});
