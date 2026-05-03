"use client";

import { useEffect, useState } from "react";
import { listMantenimientos, Mantenimiento, createMantenimiento, updateMantenimiento, completarMantenimiento, deleteMantenimiento, MantenimientoCreate } from "../../lib/clienteApiMantenimientos";
import EstadoBadge from "../../components/EstadoBadge";
import MensajeFeedback from "../../components/MensajeFeedback";
import Spinner from "../../components/Spinner";

const TIPOS_MANTENIMIENTO = ["Preventivo", "Correctivo", "Revisión técnica", "Lavado"];

export default function PaginaMantenimiento() {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ idVehiculo: "", placa: "", tipo: "Preventivo", descripcion: "", fechaProgramada: "" });
  const [editando, setEditando] = useState<number | null>(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      const data = await listMantenimientos();
      setMantenimientos(data);
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al cargar", tipo: "error" });
    } finally {
      setCargando(false);
    }
  }

  async function registrar() {
    if (!form.placa.trim() || !form.descripcion.trim() || !form.fechaProgramada) {
      setMensaje({ texto: "Placa, descripción y fecha son obligatorios.", tipo: "error" });
      return;
    }
    const data: MantenimientoCreate = {
      idVehiculo: parseInt(form.idVehiculo) || 0,
      placa: form.placa.trim().toUpperCase(),
      tipo: form.tipo,
      descripcion: form.descripcion.trim(),
      fechaProgramada: form.fechaProgramada,
    };
    try {
      if (editando !== null) {
        await updateMantenimiento(editando, data);
        setMensaje({ texto: "Mantenimiento actualizado.", tipo: "exito" });
      } else {
        await createMantenimiento(data);
        setMensaje({ texto: "Mantenimiento registrado.", tipo: "exito" });
      }
      await cargar();
      setMostrarForm(false);
      resetForm();
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al guardar", tipo: "error" });
    }
  }

  async function completar(id: number) {
    try {
      await completarMantenimiento(id);
      setMensaje({ texto: `Mantenimiento ${id} completado.`, tipo: "exito" });
      await cargar();
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al completar", tipo: "error" });
    }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Está seguro?")) return;
    try {
      await deleteMantenimiento(id);
      setMensaje({ texto: "Mantenimiento eliminado.", tipo: "exito" });
      await cargar();
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al eliminar", tipo: "error" });
    }
  }

  function resetForm() {
    setForm({ idVehiculo: "", placa: "", tipo: "Preventivo", descripcion: "", fechaProgramada: "" });
    setEditando(null);
  }

  function abrirForm(m?: Mantenimiento) {
    if (m) {
      setForm({ idVehiculo: m.idVehiculo.toString(), placa: m.placa, tipo: m.tipo, descripcion: m.descripcion, fechaProgramada: m.fechaProgramada });
      setEditando(m.id);
    }
    setMostrarForm(true);
  }

  const inputClases = "mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 font-head">Mantenimiento</h1>
          <p className="text-gray-500 text-sm mt-1">Control de mantenimientos programados y correctivos</p>
        </div>
        <button
          type="button"
          onClick={() => { resetForm(); setMostrarForm(true); }}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
        >
          + Registrar
        </button>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      {mostrarForm && (
        <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 font-head mb-4">{editando ? "Editar mantenimiento" : "Nuevo mantenimiento"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Placa</label>
              <input type="text" value={form.placa} onChange={(e) => setForm((f) => ({ ...f, placa: e.target.value }))}
                placeholder="ABC-123" className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))} className={inputClases}>
                {TIPOS_MANTENIMIENTO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Descripción</label>
              <input type="text" value={form.descripcion} onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                placeholder="Cambio de aceite y filtros" className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Fecha programada</label>
              <input type="date" value={form.fechaProgramada} onChange={(e) => setForm((f) => ({ ...f, fechaProgramada: e.target.value }))}
                className={inputClases} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setMostrarForm(false)}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
            <button type="button" onClick={registrar}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
              Guardar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 font-head">Registro de mantenimientos</h2>
          <span className="text-xs text-gray-400">{mantenimientos.length} registros</span>
        </div>
        {cargando ? (
          <div className="px-6 py-10 flex justify-center">
            <Spinner />
          </div>
        ) : mantenimientos.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-400">No hay mantenimientos registrados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Placa</th>
                  <th className="px-5 py-3 text-left">Tipo</th>
                  <th className="px-5 py-3 text-left">Descripción</th>
                  <th className="px-5 py-3 text-left">Fecha</th>
                  <th className="px-5 py-3 text-left">Estado</th>
                  <th className="px-5 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mantenimientos.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{m.id}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">{m.placa}</td>
                    <td className="px-5 py-3 text-gray-700">{m.tipo}</td>
                    <td className="px-5 py-3 text-gray-600">{m.descripcion}</td>
                    <td className="px-5 py-3 text-gray-500">{m.fechaProgramada}</td>
                    <td className="px-5 py-3"><EstadoBadge estado={m.estado} /></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        {m.estado !== "COMPLETADO" && (
                          <>
                            <button
                              type="button"
                              onClick={() => abrirForm(m)}
                              className="px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => completar(m.id)}
                              className="px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                            >
                              Completar
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => eliminar(m.id)}
                          className="px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Eliminar
                        </button>
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
