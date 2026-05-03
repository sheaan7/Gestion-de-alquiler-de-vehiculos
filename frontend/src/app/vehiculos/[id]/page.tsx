"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { obtenerVehiculo, alquilarVehiculo } from "../../../lib/clienteApi";
import { Vehiculo } from "../../../types/vehiculo";
import Spinner from "../../../components/Spinner";
import EstadoBadge from "../../../components/EstadoBadge";
import MensajeFeedback from "../../../components/MensajeFeedback";

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
      setMensaje({ texto: `Operación ${op.idOperacion.slice(0, 8)}… confirmada`, tipo: "exito" });
      setVehiculo((prev) => (prev ? { ...prev, estado: "NO_DISPONIBLE" } : prev));
    } catch (e) {
      setMensaje({ texto: e instanceof Error ? e.message : "Error al alquilar", tipo: "error" });
    } finally {
      setProcesando(false);
    }
  }

  if (cargando) return <Spinner />;

  return (
    <div className="max-w-lg">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        ← Volver
      </button>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      {vehiculo ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 font-head">
                {vehiculo.marca} {vehiculo.modelo}
              </h1>
              <span className="mt-2 inline-block font-mono text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg font-bold">
                {vehiculo.placa}
              </span>
            </div>
            <EstadoBadge estado={vehiculo.estado} />
          </div>

          <div className="divide-y divide-gray-100 mb-6">
            {[
              { label: "Marca", valor: vehiculo.marca },
              { label: "Modelo", valor: vehiculo.modelo },
              { label: "Año", valor: vehiculo.anio },
              { label: "Tipo", valor: vehiculo.tipo },
              { label: "Km actuales", valor: `${vehiculo.km_actuales.toLocaleString("es-CO")} km` },
            ].map(({ label, valor }) => (
              <div key={label} className="flex justify-between py-3 text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-900">{valor}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 text-sm">
              <span className="text-gray-500">Estado</span>
              <EstadoBadge estado={vehiculo.estado} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => void alquilar()}
            disabled={vehiculo.estado !== "DISPONIBLE" || procesando}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
