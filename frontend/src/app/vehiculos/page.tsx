"use client";

import { useState } from "react";
import { useVehiculos } from "../../hooks/useVehiculos";
import { alquilarVehiculo } from "../../lib/clienteApi";
import { EstadoVehiculo } from "../../types/vehiculo";
import VehiculoCard from "../../components/VehiculoCard";
import Spinner from "../../components/Spinner";
import MensajeFeedback from "../../components/MensajeFeedback";

type Filtro = "TODOS" | EstadoVehiculo;

const FILTROS: { valor: Filtro; label: string }[] = [
  { valor: "TODOS", label: "Todos" },
  { valor: "DISPONIBLE", label: "Disponibles" },
  { valor: "NO_DISPONIBLE", label: "No disponibles" },
];

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
      setMensaje({ texto: `Operación ${op.idOperacion.slice(0, 8)}… confirmada`, tipo: "exito" });
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
          <h1 className="text-3xl font-extrabold text-gray-900 font-head">Flota de Vehículos</h1>
          <p className="text-gray-500 text-sm mt-1">{vehiculos.length} vehículos registrados</p>
        </div>
        <div className="flex gap-2">
          {FILTROS.map(({ valor, label }) => (
            <button
              key={valor}
              type="button"
              onClick={() => setFiltro(valor)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filtro === valor
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-300 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      {error && <MensajeFeedback texto={error} tipo="error" />}
      {cargando && <Spinner />}

      {!cargando && !error && (
        filtrados.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-sm">No hay vehículos con ese estado.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtrados.map((v) => (
              <VehiculoCard key={v.id} vehiculo={v} onAlquilar={alquilar} procesando={procesando === v.id} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
