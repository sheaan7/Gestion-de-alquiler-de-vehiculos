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
      setMensaje({ texto: `Operación ${op.idOperacion} confirmada`, tipo: "exito" });
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
        setMensaje({ texto: "Vehículo creado exitosamente", tipo: "exito" });
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
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Vehículos</h1>
          <p className="text-gray-500 text-sm mt-1">Panel administrativo — CRUD completo</p>
        </div>
        <button
          type="button"
          onClick={() => setModalConfig({ modo: "crear" })}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Nuevo Vehículo
        </button>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {cargando && <Spinner />}
        {error && !cargando && (
          <div className="p-6"><MensajeFeedback texto={error} tipo="error" /></div>
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
