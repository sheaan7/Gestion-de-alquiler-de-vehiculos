"use client";

import { useEffect, useState } from "react";
import { listReservas, Reserva, confirmarReserva, cancelarReserva, deleteReserva } from "../../lib/clienteApiReservas";
import EstadoBadge from "../../components/EstadoBadge";
import MensajeFeedback from "../../components/MensajeFeedback";
import Spinner from "../../components/Spinner";

export default function PaginaReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ idCliente: "", nombreCliente: "", idVehiculo: "", placa: "", fechaReserva: "", fechaInicio: "" });
  const [mostrarConfirmar, setMostrarConfirmar] = useState<number | null>(null);
  const [confirmForm, setConfirmForm] = useState({ fechaFin: "", valorDiario: "" });

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      const data = await listReservas();
      setReservas(data);
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al cargar", tipo: "error" });
    } finally {
      setCargando(false);
    }
  }

  async function crear() {
    if (!form.nombreCliente.trim() || !form.placa.trim() || !form.fechaReserva || !form.fechaInicio) {
      setMensaje({ texto: "Todos los campos son requeridos", tipo: "error" });
      return;
    }
    try {
      await listReservas();
      setMensaje({ texto: "Reserva creada", tipo: "exito" });
      await cargar();
      setMostrarForm(false);
      setForm({ idCliente: "", nombreCliente: "", idVehiculo: "", placa: "", fechaReserva: "", fechaInicio: "" });
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al crear", tipo: "error" });
    }
  }

  async function confirmar(id: number) {
    if (!confirmForm.fechaFin || !confirmForm.valorDiario) {
      setMensaje({ texto: "Fecha fin y valor diario son requeridos", tipo: "error" });
      return;
    }
    try {
      await confirmarReserva(id, { fechaFin: confirmForm.fechaFin, valorDiario: parseInt(confirmForm.valorDiario) || 0 });
      setMensaje({ texto: "Reserva confirmada", tipo: "exito" });
      await cargar();
      setMostrarConfirmar(null);
      setConfirmForm({ fechaFin: "", valorDiario: "" });
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al confirmar", tipo: "error" });
    }
  }

  async function cancelar(id: number) {
    try {
      await cancelarReserva(id);
      setMensaje({ texto: "Reserva cancelada", tipo: "exito" });
      await cargar();
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al cancelar", tipo: "error" });
    }
  }

  async function eliminar(id: number) {
    if (!confirm("¿Está seguro?")) return;
    try {
      await deleteReserva(id);
      setMensaje({ texto: "Reserva eliminada", tipo: "exito" });
      await cargar();
    } catch (err) {
      setMensaje({ texto: err instanceof Error ? err.message : "Error al eliminar", tipo: "error" });
    }
  }

  const inputClases = "mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";


  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 font-head">Reservas</h1>
          <p className="text-gray-500 text-sm mt-1">Reservas pendientes y confirmadas</p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarForm(!mostrarForm)}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
        >
          + Nueva
        </button>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      {mostrarForm && (
        <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 font-head mb-4">Nueva reserva</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Cliente</label>
              <input type="text" value={form.nombreCliente} onChange={(e) => setForm((f) => ({ ...f, nombreCliente: e.target.value }))} placeholder="Nombre" className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Placa</label>
              <input type="text" value={form.placa} onChange={(e) => setForm((f) => ({ ...f, placa: e.target.value }))} placeholder="ABC-123" className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Fecha reserva</label>
              <input type="date" value={form.fechaReserva} onChange={(e) => setForm((f) => ({ ...f, fechaReserva: e.target.value }))} className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Inicio</label>
              <input type="date" value={form.fechaInicio} onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value }))} className={inputClases} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setMostrarForm(false)} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
            <button type="button" onClick={crear} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">Crear</button>
          </div>
        </div>
      )}

      {mostrarConfirmar !== null && (
        <div className="mb-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="font-bold text-gray-800 font-head mb-4">Confirmar reserva</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Fecha fin</label>
              <input type="date" value={confirmForm.fechaFin} onChange={(e) => setConfirmForm((f) => ({ ...f, fechaFin: e.target.value }))} className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Valor/día</label>
              <input type="number" value={confirmForm.valorDiario} onChange={(e) => setConfirmForm((f) => ({ ...f, valorDiario: e.target.value }))} placeholder="100000" className={inputClases} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => { setMostrarConfirmar(null); setConfirmForm({ fechaFin: "", valorDiario: "" }); }} className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
            <button type="button" onClick={() => confirmar(mostrarConfirmar)} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition-colors">Confirmar</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 font-head">Registro de reservas</h2>
          <span className="text-xs text-gray-400">{reservas.length} registros</span>
        </div>
        {cargando ? (
          <div className="px-6 py-10 flex justify-center">
            <Spinner />
          </div>
        ) : reservas.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-400">No hay reservas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Cliente</th>
                  <th className="px-5 py-3 text-left">Vehículo</th>
                  <th className="px-5 py-3 text-left">Fecha reserva</th>
                  <th className="px-5 py-3 text-left">Inicio</th>
                  <th className="px-5 py-3 text-left">Estado</th>
                  <th className="px-5 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reservas.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-400">{r.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{r.nombreCliente}</td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">{r.placa}</td>
                    <td className="px-5 py-3 text-gray-500">{r.fechaReserva}</td>
                    <td className="px-5 py-3 text-gray-500">{r.fechaInicio}</td>
                    <td className="px-5 py-3">
                      <EstadoBadge estado={r.estado} />
                    </td>
                    <td className="px-5 py-3">
                      {r.estado === "PENDIENTE" && (
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => setMostrarConfirmar(r.id)}
                            className="px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => cancelar(r.id)}
                            className="px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => eliminar(r.id)}
                        className="px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Eliminar
                      </button>
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
