import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { listarVehiculos } from "./clienteApi";

describe("clienteApi", () => {
  it("construye endpoint de vehiculos", async () => {
    const simuladorFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    });
    vi.stubGlobal("fetch", simuladorFetch);

    await listarVehiculos();

    expect(simuladorFetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/vehiculos",
      { cache: "no-store" }
    );
    vi.unstubAllGlobals();
  });
});

describe("compose frontend", () => {
  it("define NEXT_PUBLIC_URL_GATEWAY en Dockerfile", () => {
    const rutaDockerfile = resolve(process.cwd(), "Dockerfile");
    const contenido = readFileSync(rutaDockerfile, "utf8");
    expect(contenido).toContain("ENV NEXT_PUBLIC_URL_GATEWAY=http://localhost:8080");
  });
});
