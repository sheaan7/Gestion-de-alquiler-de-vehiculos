"use client";

import { useState } from "react";
import { useVehiculos } from "../../hooks/useVehiculos";
import {
  alquilarVehiculo,
  crearVehiculo,
  actualizarVehiculo,
  eliminarVehiculo,
} from "../../lib/clienteApi";
import { VehiculoInput } from "../../types/vehiculo";
import VehiculoTable from "../../components/VehiculoTable";
import VehiculoModal, { ModalConfig } from "../../components/VehiculoModal";
import Spinner from "../../components/Spinner";
import MensajeFeedback from "../../components/MensajeFeedback";

export default function AdminPage() {
  const { vehiculos, cargando, error, recargar } = useVehiculos();
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);

  async function alquilar(idVehiculo: number) {
    setProcesando(`v-${idVehiculo}`);
    setMensaje(null);
    try {
      const op = await alquilarVehiculo(idVehiculo);
      setMensaje({ texto: `Operación ${op.idOperacion.slice(0, 8)}… confirmada`, tipo: "exito" });
      await recargar();
    } catch (e) {
      setMensaje({ texto: e instanceof Error ? e.message : "Error al alquilar", tipo: "error" });
    } finally {
      setProcesando(null);
    }
  }

  async function confirmarModal(input?: VehiculoInput) {
    if (!modalConfig) return;
    setProcesando("modal");
    setMensaje(null);
    try {
      if (modalConfig.modo === "crear" && input) {
        await crearVehiculo(input);
        setMensaje({ texto: "Vehículo registrado exitosamente", tipo: "exito" });
      } else if (modalConfig.modo === "editar" && input) {
        await actualizarVehiculo(modalConfig.vehiculo.id, input);
        setMensaje({ texto: "Vehículo actualizado exitosamente", tipo: "exito" });
      } else if (modalConfig.modo === "eliminar") {
        await eliminarVehiculo(modalConfig.vehiculo.id);
        setMensaje({ texto: "Vehículo eliminado exitosamente", tipo: "exito" });
      }
      setModalConfig(null);
      await recargar();
    } catch (e) {
      setMensaje({ texto: e instanceof Error ? e.message : "Error en la operación", tipo: "error" });
    } finally {
      setProcesando(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 font-head">Administración</h1>
          <p className="text-gray-500 text-sm mt-1">Gestión de inventario — CRUD completo</p>
        </div>
        <button
          type="button"
          onClick={() => setModalConfig({ modo: "crear" })}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
        >
          + Agregar Vehículo
        </button>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 font-head">Inventario de vehículos</h2>
          <span className="text-xs text-gray-400">{vehiculos.length} registros</span>
        </div>
        {cargando && <Spinner />}
        {error && !cargando && (
          <div className="p-5">
            <MensajeFeedback texto={error} tipo="error" />
          </div>
        )}
        {!cargando && !error && (
          <VehiculoTable
            vehiculos={vehiculos}
            procesando={procesando}
            onAlquilar={alquilar}
            onAbrirModal={setModalConfig}
          />
        )}
      </div>

      {modalConfig && (
        <VehiculoModal
          config={modalConfig}
          procesando={procesando === "modal"}
          onConfirmar={(input) => void confirmarModal(input)}
          onCerrar={() => { if (procesando !== "modal") setModalConfig(null); }}
        />
      )}
    </div>
  );
}
