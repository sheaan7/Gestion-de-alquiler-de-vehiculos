"use client";

import { useState } from "react";
import { useClientes } from "../../hooks/useClientes";
import { crearCliente, actualizarCliente, eliminarCliente, buscarClientes } from "../../lib/clienteApiClientes";
import { ClienteInput } from "../../types/cliente";
import ClienteTable from "../../components/ClienteTable";
import ClienteModal, { ModalConfig } from "../../components/ClienteModal";
import Spinner from "../../components/Spinner";
import MensajeFeedback from "../../components/MensajeFeedback";

export default function PaginaClientes() {
  const { clientes, cargando, error, recargar } = useClientes();
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [clientesBusqueda, setClientesBusqueda] = useState<typeof clientes | null>(null);
  const [buscando, setBuscando] = useState(false);

  const clientesMostrados = clientesBusqueda ?? clientes;

  async function handleBuscar(q: string) {
    setBusqueda(q);
    if (!q.trim()) { setClientesBusqueda(null); return; }
    setBuscando(true);
    try {
      setClientesBusqueda(await buscarClientes(q));
    } catch {
      setClientesBusqueda([]);
    } finally {
      setBuscando(false);
    }
  }

  async function confirmarModal(input?: ClienteInput) {
    if (!modalConfig) return;
    setProcesando("modal");
    setMensaje(null);
    try {
      if (modalConfig.modo === "crear" && input) {
        await crearCliente(input);
        setMensaje({ texto: "Cliente registrado exitosamente", tipo: "exito" });
      } else if (modalConfig.modo === "editar" && input) {
        await actualizarCliente(modalConfig.cliente.id, input);
        setMensaje({ texto: "Cliente actualizado exitosamente", tipo: "exito" });
      } else if (modalConfig.modo === "eliminar") {
        await eliminarCliente(modalConfig.cliente.id);
        setMensaje({ texto: "Cliente eliminado exitosamente", tipo: "exito" });
      }
      setModalConfig(null);
      setClientesBusqueda(null);
      setBusqueda("");
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
          <h1 className="text-3xl font-extrabold text-gray-900 font-head">Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">Gestión de clientes registrados</p>
        </div>
        <button
          type="button"
          onClick={() => setModalConfig({ modo: "crear" })}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
        >
          + Nuevo Cliente
        </button>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <h2 className="font-bold text-gray-800 font-head whitespace-nowrap">
            Registro de clientes
          </h2>
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => void handleBuscar(e.target.value)}
              placeholder="Buscar por nombre, cédula o email..."
              className="w-full border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {buscando && <span className="text-xs text-gray-400">Buscando…</span>}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{clientesMostrados.length} registros</span>
        </div>

        {cargando ? (
          <Spinner />
        ) : error ? (
          <div className="p-5">
            <MensajeFeedback texto={error} tipo="error" />
          </div>
        ) : (
          <ClienteTable
            clientes={clientesMostrados}
            procesando={procesando}
            onAbrirModal={setModalConfig}
          />
        )}
      </div>

      {modalConfig && (
        <ClienteModal
          config={modalConfig}
          procesando={procesando === "modal"}
          onConfirmar={(input) => void confirmarModal(input)}
          onCerrar={() => { if (procesando !== "modal") setModalConfig(null); }}
        />
      )}
    </div>
  );
}
