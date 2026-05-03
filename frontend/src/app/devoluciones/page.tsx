"use client";

import { useEffect, useState } from "react";
import { listDevoluciones, Devolucion, registrarDevolucion } from "../../lib/clienteApiDevoluciones";
import EstadoBadge from "../../components/EstadoBadge";
import MensajeFeedback from "../../components/MensajeFeedback";
import Spinner from "../../components/Spinner";

export default function PaginaDevoluciones() {
  const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ idContrato: "", kmDevolucion: "" });

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      const data = await listDevoluciones();
      setDevoluciones(data);
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al cargar", tipo: "error" });
    } finally {
      setCargando(false);
    }
  }

  async function registrar() {
    if (!form.idContrato || !form.kmDevolucion) {
      setMensaje({ texto: "Contrato y km son requeridos", tipo: "error" });
      return;
    }
    try {
      await registrarDevolucion({ idContrato: parseInt(form.idContrato), kmDevolucion: parseInt(form.kmDevolucion) });
      setMensaje({ texto: "Devolución registrada", tipo: "exito" });
      await cargar();
      setMostrarForm(false);
      setForm({ idContrato: "", kmDevolucion: "" });
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al registrar", tipo: "error" });
    }
  }

  const inputClases = "mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 font-head">Devoluciones</h1>
          <p className="text-gray-500 text-sm mt-1">Historial de devoluciones de vehículos</p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarForm(!mostrarForm)}
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
          <h3 className="font-bold text-gray-800 font-head mb-4">Registrar devolución</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Contrato ID</label>
              <input type="number" value={form.idContrato} onChange={(e) => setForm((f) => ({ ...f, idContrato: e.target.value }))} placeholder="1" className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">KM Entregados</label>
              <input type="number" value={form.kmDevolucion} onChange={(e) => setForm((f) => ({ ...f, kmDevolucion: e.target.value }))} placeholder="45800" className={inputClases} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setMostrarForm(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
            <button type="button" onClick={registrar} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">Registrar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 font-head">Registro de devoluciones</h2>
          <span className="text-xs text-gray-400">{devoluciones.length} registros</span>
        </div>
        {cargando ? (
          <div className="px-6 py-10 flex justify-center">
            <Spinner />
          </div>
        ) : devoluciones.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-400">No hay devoluciones registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Contrato</th>
                  <th className="px-5 py-3 text-left">Placa</th>
                  <th className="px-5 py-3 text-left">Fecha devolución</th>
                  <th className="px-5 py-3 text-left">Km entregados</th>
                  <th className="px-5 py-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {devoluciones.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{d.id}</td>
                    <td className="px-5 py-3 text-gray-600">#{d.idContrato}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">{d.placa}</td>
                    <td className="px-5 py-3 text-gray-500">{d.fechaDevolucion}</td>
                    <td className="px-5 py-3 text-gray-700">{d.kmDevolucion.toLocaleString()} km</td>
                    <td className="px-5 py-3">
                      <EstadoBadge estado={d.estado} />
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
