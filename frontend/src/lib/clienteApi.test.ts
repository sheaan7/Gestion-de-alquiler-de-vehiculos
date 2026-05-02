import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { listarVehiculos } from "./clienteApi";

describe("clienteApi", () => {
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
    vi.unstubAllGlobals();
  });
});

describe("compose frontend", () => {
  it("define URL_GATEWAY en Dockerfile", () => {
    const rutaDockerfile = resolve(process.cwd(), "Dockerfile");
    const contenido = readFileSync(rutaDockerfile, "utf8");
    expect(contenido).toContain("ENV URL_GATEWAY=http://localhost:8080");
  });
});
