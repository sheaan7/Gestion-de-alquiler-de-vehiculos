"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { obtenerVehiculo, alquilarVehiculo } from "../../../lib/clienteApi";
import { Vehiculo } from "../../../types/vehiculo";
import Spinner from "../../../components/Spinner";
import MensajeFeedback from "../../../components/MensajeFeedback";
import EstadoBadge from "../../../components/EstadoBadge";

export default function DetalleVehiculo() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        setVehiculo(await obtenerVehiculo(Number(id)));
      } catch (e) {
        setMensaje({ texto: e instanceof Error ? e.message : "No se encontró el vehículo", tipo: "error" });
      } finally {
        setCargando(false);
      }
    }
    void cargar();
  }, [id]);

  async function alquilar() {
    if (!vehiculo) return;
    setProcesando(true);
    setMensaje(null);
    try {
      const op = await alquilarVehiculo(vehiculo.id);
      setMensaje({ texto: `Operación ${op.idOperacion} confirmada`, tipo: "exito" });
      setVehiculo((prev) => prev ? { ...prev, estado: "NO_DISPONIBLE" } : prev);
    } catch (e) {
      setMensaje({ texto: e instanceof Error ? e.message : "Error al alquilar", tipo: "error" });
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) return <Spinner />;

  return (
    <div className="max-w-lg mx-auto">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        ← Volver
      </button>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      {vehiculo ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{vehiculo.marca} {vehiculo.modelo}</h1>
              <p className="text-sm text-gray-400 mt-1">ID: {vehiculo.id}</p>
            </div>
            <EstadoBadge estado={vehiculo.estado} />
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Marca</span>
              <span className="text-sm font-medium text-gray-800">{vehiculo.marca}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Modelo</span>
              <span className="text-sm font-medium text-gray-800">{vehiculo.modelo}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">Estado</span>
              <EstadoBadge estado={vehiculo.estado} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => void alquilar()}
            disabled={vehiculo.estado !== "DISPONIBLE" || procesando}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {procesando ? "Procesando..." : vehiculo.estado === "DISPONIBLE" ? "Alquilar vehículo" : "No disponible"}
          </button>
        </div>
      ) : (
        <MensajeFeedback texto="No se encontró el vehículo" tipo="error" />
      )}
    </div>
  );
}
