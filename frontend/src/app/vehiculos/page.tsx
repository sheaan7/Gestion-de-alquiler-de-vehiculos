"use client";

import { useState } from "react";
import { useVehiculos } from "../../hooks/useVehiculos";
import { alquilarVehiculo } from "../../lib/clienteApi";
import { EstadoVehiculo } from "../../types/vehiculo";
import VehiculoCard from "../../components/VehiculoCard";
import Spinner from "../../components/Spinner";
import MensajeFeedback from "../../components/MensajeFeedback";

type Filtro = "TODOS" | EstadoVehiculo;

export default function PaginaVehiculos() {
  const { vehiculos, cargando, error, recargar } = useVehiculos();
  const [filtro, setFiltro] = useState<Filtro>("TODOS");
  const [procesando, setProcesando] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);

  const filtrados = filtro === "TODOS" ? vehiculos : vehiculos.filter((v) => v.estado === filtro);

  async function alquilar(id: number) {
    setProcesando(id);
    setMensaje(null);
    try {
      const op = await alquilarVehiculo(id);
      setMensaje({ texto: `Operación ${op.idOperacion} confirmada`, tipo: "exito" });
      await recargar();
    } catch (e) {
      setMensaje({ texto: e instanceof Error ? e.message : "Error al alquilar", tipo: "error" });
    } finally {
      setProcesando(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehículos</h1>
          <p className="text-gray-500 text-sm mt-1">{vehiculos.length} vehículos en total</p>
        </div>
        <div className="flex gap-2">
          {(["TODOS", "DISPONIBLE", "NO_DISPONIBLE"] as Filtro[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filtro === f ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {f === "TODOS" ? "Todos" : f === "DISPONIBLE" ? "Disponibles" : "No disponibles"}
            </button>
          ))}
        </div>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      {cargando && <Spinner />}
      {error && !cargando && <MensajeFeedback texto={error} tipo="error" />}

      {!cargando && !error && (
        <>
          {filtrados.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No hay vehículos con ese estado.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtrados.map((v) => (
                <VehiculoCard
                  key={v.id}
                  vehiculo={v}
                  onAlquilar={alquilar}
                  procesando={procesando === v.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
