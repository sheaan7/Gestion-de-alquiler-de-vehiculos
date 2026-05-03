"use client";

import { useEffect, useState } from "react";
import { Cliente, ClienteInput, TIPOS_CLIENTE } from "../types/cliente";

export type ModalConfig =
  | { modo: "crear" }
  | { modo: "editar"; cliente: Cliente }
  | { modo: "eliminar"; cliente: Cliente };

interface ClienteModalProps {
  config: ModalConfig;
  procesando: boolean;
  onConfirmar: (input?: ClienteInput) => void;
  onCerrar: () => void;
}

const FORMULARIO_VACIO: ClienteInput = {
  nombre: "",
  cedulaNit: "",
  telefono: "",
  email: "",
  direccion: "",
  licencia: "",
  tipoCliente: "Particular",
  activo: true,
};

const inputClases =
  "mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 transition";

export default function ClienteModal({ config, procesando, onConfirmar, onCerrar }: ClienteModalProps) {
  const [form, setForm] = useState<ClienteInput>(FORMULARIO_VACIO);
  const [errorForm, setErrorForm] = useState<string | null>(null);

  useEffect(() => {
    if (config.modo === "editar") {
      const { nombre, cedulaNit, telefono, email, direccion, licencia, tipoCliente, activo } = config.cliente;
      setForm({ nombre, cedulaNit, telefono, email, direccion, licencia, tipoCliente, activo });
    } else {
      setForm(FORMULARIO_VACIO);
    }
  }, [config]);

  function cerrar() {
    if (procesando) return;
    setErrorForm(null);
    onCerrar();
  }

  function confirmar() {
    if (config.modo === "eliminar") { onConfirmar(); return; }
    if (!form.nombre.trim() || !form.cedulaNit.trim() || !form.email.trim() || !form.telefono.trim()) {
      setErrorForm("Nombre, cédula/NIT, teléfono y email son obligatorios.");
      return;
    }
    setErrorForm(null);
    onConfirmar({ ...form, nombre: form.nombre.trim(), email: form.email.trim() });
  }

  function campo<K extends keyof ClienteInput>(key: K, valor: ClienteInput[K]) {
    setForm((prev) => ({ ...prev, [key]: valor }));
  }

  const titulo = config.modo === "crear" ? "Nuevo Cliente" : config.modo === "editar" ? "Editar Cliente" : "Eliminar Cliente";
  const textoBoton = config.modo === "crear" ? "Guardar Cliente" : config.modo === "editar" ? "Guardar cambios" : "Eliminar";

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={cerrar} disabled={procesando}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-40 text-lg leading-none">
          ✕
        </button>

        <h3 className="text-xl font-bold text-gray-900 font-head mb-5">{titulo}</h3>

        {config.modo === "eliminar" ? (
          <p className="text-sm text-gray-600 mb-6">
            ¿Eliminar a{" "}
            <span className="font-bold text-gray-900">{config.cliente.nombre}</span>
            ? Esta acción no se puede deshacer.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre completo</label>
              <input type="text" value={form.nombre} onChange={(e) => campo("nombre", e.target.value)}
                placeholder="María García" disabled={procesando} className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cédula / NIT</label>
              <input type="text" value={form.cedulaNit} onChange={(e) => campo("cedulaNit", e.target.value)}
                placeholder="52145789" disabled={procesando} className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Teléfono</label>
              <input type="text" value={form.telefono} onChange={(e) => campo("telefono", e.target.value)}
                placeholder="3001112233" disabled={procesando} className={inputClases} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
              <input type="email" value={form.email} onChange={(e) => campo("email", e.target.value)}
                placeholder="cliente@email.com" disabled={procesando} className={inputClases} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dirección</label>
              <input type="text" value={form.direccion} onChange={(e) => campo("direccion", e.target.value)}
                placeholder="Cll 80 #15-20" disabled={procesando} className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Licencia</label>
              <input type="text" value={form.licencia} onChange={(e) => campo("licencia", e.target.value)}
                placeholder="B1" disabled={procesando} className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo cliente</label>
              <select value={form.tipoCliente} onChange={(e) => campo("tipoCliente", e.target.value)}
                disabled={procesando} className={inputClases}>
                {TIPOS_CLIENTE.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="activo" checked={form.activo} onChange={(e) => campo("activo", e.target.checked)}
                disabled={procesando} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
              <label htmlFor="activo" className="text-sm text-gray-700 font-medium">Cliente activo</label>
            </div>
            {errorForm && <p className="col-span-2 text-xs text-red-600 font-semibold">{errorForm}</p>}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button type="button" onClick={cerrar} disabled={procesando}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-40 transition-colors">
            Cancelar
          </button>
          <button type="button" onClick={confirmar} disabled={procesando}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-40 transition-colors ${
              config.modo === "eliminar" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }`}>
            {procesando ? "Procesando..." : textoBoton}
          </button>
        </div>
      </div>
    </div>
  );
}
