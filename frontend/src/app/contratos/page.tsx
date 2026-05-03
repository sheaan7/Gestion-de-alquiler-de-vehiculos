"use client";

import { useEffect, useState } from "react";
import { listContratos, Contrato, updateContrato, ContratoCreate } from "../../lib/clienteApiContratos";
import { deleteContrato } from "../../lib/clienteApiContratos";
import EstadoBadge from "../../components/EstadoBadge";
import MensajeFeedback from "../../components/MensajeFeedback";
import Spinner from "../../components/Spinner";

type EstadoContrato = "ACTIVO" | "VENCIDO" | "COMPLETADO" | "PENDIENTE";

const TABS: { label: string; value: EstadoContrato | "TODOS" }[] = [
  { label: "Todos", value: "TODOS" },
  { label: "Activos", value: "ACTIVO" },
  { label: "Pendientes", value: "PENDIENTE" },
  { label: "Vencidos", value: "VENCIDO" },
  { label: "Completados", value: "COMPLETADO" },
];

export default function PaginaContratos() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [tab, setTab] = useState<EstadoContrato | "TODOS">("TODOS");
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ idCliente: "", nombreCliente: "", idVehiculo: "", placa: "", fechaInicio: "", fechaFin: "", valorDiario: "" });
  const [editando, setEditando] = useState<number | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      const data = await listContratos();
      setContratos(data);
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al cargar", tipo: "error" });
    } finally {
      setCargando(false);
    }
  }

  const visibles = tab === "TODOS" ? contratos : contratos.filter((c) => c.estado === tab);

  async function guardar() {
    if (!form.nombreCliente.trim() || !form.placa.trim() || !form.fechaInicio || !form.fechaFin || !form.valorDiario) {
      setMensaje({ texto: "Todos los campos son requeridos", tipo: "error" });
      return;
    }
    const data: ContratoCreate = {
      idCliente: parseInt(form.idCliente) || 0,
      nombreCliente: form.nombreCliente.trim(),
      idVehiculo: parseInt(form.idVehiculo) || 0,
      placa: form.placa.trim().toUpperCase(),
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
      valorDiario: parseInt(form.valorDiario) || 0,
    };
    try {
      if (editando !== null) {
        await updateContrato(editando, data);
        setMensaje({ texto: "Contrato actualizado", tipo: "exito" });
      } else {
        const res = await listContratos();
        setContratos(res);
        setMensaje({ texto: "Contrato creado", tipo: "exito" });
      }
      await cargar();
      setMostrarForm(false);
      resetForm();
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al guardar", tipo: "error" });
    }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Está seguro de que desea eliminar este contrato?")) return;
    try {
      await deleteContrato(id);
      setMensaje({ texto: "Contrato eliminado", tipo: "exito" });
      await cargar();
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al eliminar", tipo: "error" });
    }
  }

  function resetForm() {
    setForm({ idCliente: "", nombreCliente: "", idVehiculo: "", placa: "", fechaInicio: "", fechaFin: "", valorDiario: "" });
    setEditando(null);
  }

  function abrirForm(contrato?: Contrato) {
    if (contrato) {
      setForm({ idCliente: contrato.idCliente.toString(), nombreCliente: contrato.nombreCliente, idVehiculo: contrato.idVehiculo.toString(), placa: contrato.placa, fechaInicio: contrato.fechaInicio, fechaFin: contrato.fechaFin, valorDiario: contrato.valorDiario.toString() });
      setEditando(contrato.id);
    }
    setMostrarForm(true);
  }

  async function marcarCompletado(id: number) {
    const contrato = contratos.find((c) => c.id === id);
    if (!contrato) return;
    try {
      await updateContrato(id, { ...contrato, estado: "COMPLETADO" });
      setMensaje({ texto: `Contrato #${id} marcado como completado.`, tipo: "exito" });
      await cargar();
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al completar", tipo: "error" });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 font-head">Contratos de Arrendamiento</h1>
          <p className="text-gray-500 text-sm mt-1">Gestión de contratos activos, vencidos y pendientes</p>
        </div>
        <button
          type="button"
          onClick={() => { resetForm(); setMostrarForm(true); }}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
        >
          + Nuevo
        </button>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      <div className="flex gap-1 mb-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === t.value ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {mostrarForm && (
        <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 font-head mb-4">{editando ? "Editar contrato" : "Nuevo contrato"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Cliente</label>
              <input type="text" value={form.nombreCliente} onChange={(e) => setForm((f) => ({ ...f, nombreCliente: e.target.value }))} placeholder="Nombre" className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Placa</label>
              <input type="text" value={form.placa} onChange={(e) => setForm((f) => ({ ...f, placa: e.target.value }))} placeholder="ABC-123" className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Inicio</label>
              <input type="date" value={form.fechaInicio} onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value }))} className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Fin</label>
              <input type="date" value={form.fechaFin} onChange={(e) => setForm((f) => ({ ...f, fechaFin: e.target.value }))} className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Valor/día</label>
              <input type="number" value={form.valorDiario} onChange={(e) => setForm((f) => ({ ...f, valorDiario: e.target.value }))} placeholder="100000" className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setMostrarForm(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
            <button type="button" onClick={guardar} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">Guardar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 font-head">Contratos</h2>
          <span className="text-xs text-gray-400">{visibles.length} registros</span>
        </div>
        {cargando ? (
          <div className="px-6 py-10 flex justify-center">
            <Spinner />
          </div>
        ) : visibles.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-400">No hay contratos en este estado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Cliente</th>
                  <th className="px-5 py-3 text-left">Vehículo</th>
                  <th className="px-5 py-3 text-left">Inicio</th>
                  <th className="px-5 py-3 text-left">Fin</th>
                  <th className="px-5 py-3 text-left">Valor/día</th>
                  <th className="px-5 py-3 text-left">Estado</th>
                  <th className="px-5 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibles.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-400 text-xs">{c.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{c.nombreCliente}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">{c.placa}</td>
                    <td className="px-5 py-3 text-gray-500">{c.fechaInicio}</td>
                    <td className="px-5 py-3 text-gray-500">{c.fechaFin}</td>
                    <td className="px-5 py-3 text-gray-700 font-medium">
                      ${c.valorDiario.toLocaleString("es-CO")}
                    </td>
                    <td className="px-5 py-3">
                      <EstadoBadge estado={c.estado} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        {c.estado === "ACTIVO" && (
                          <>
                            <button type="button" onClick={() => abrirForm(c)} className="px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">Editar</button>
                            <button type="button" onClick={() => marcarCompletado(c.id)} className="px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">Completar</button>
                          </>
                        )}
                        <button type="button" onClick={() => eliminar(c.id)} className="px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
