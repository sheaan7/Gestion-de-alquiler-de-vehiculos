"use client";

import { useEffect, useState } from "react";
import { Vehiculo, VehiculoInput, TIPOS_VEHICULO } from "../types/vehiculo";

export type ModalConfig =
  | { modo: "crear" }
  | { modo: "editar"; vehiculo: Vehiculo }
  | { modo: "eliminar"; vehiculo: Vehiculo };

interface VehiculoModalProps {
  config: ModalConfig;
  procesando: boolean;
  onConfirmar: (input?: VehiculoInput) => void;
  onCerrar: () => void;
}

const FORMULARIO_VACIO: VehiculoInput = {
  placa: "",
  marca: "",
  modelo: "",
  anio: new Date().getFullYear(),
  tipo: "SUV",
  km_actuales: 0,
  estado: "DISPONIBLE",
};

const inputClases =
  "mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 transition";

export default function VehiculoModal({ config, procesando, onConfirmar, onCerrar }: VehiculoModalProps) {
  const [formulario, setFormulario] = useState<VehiculoInput>(FORMULARIO_VACIO);
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

  useEffect(() => {
    if (config.modo === "editar") {
      const { placa, marca, modelo, anio, tipo, km_actuales, estado } = config.vehiculo;
      setFormulario({ placa, marca, modelo, anio, tipo, km_actuales, estado });
      return;
    }
    setFormulario(FORMULARIO_VACIO);
  }, [config]);

  function cerrar() {
    if (procesando) return;
    setErrorFormulario(null);
    onCerrar();
  }

  function confirmar() {
    if (config.modo === "eliminar") {
      onConfirmar();
      return;
    }
    const placa = formulario.placa.trim();
    const marca = formulario.marca.trim();
    const modelo = formulario.modelo.trim();

    if (!placa || !marca || !modelo) {
      setErrorFormulario("Placa, marca y modelo son obligatorios.");
      return;
    }
    if (!formulario.anio || formulario.anio < 1990 || formulario.anio > new Date().getFullYear() + 1) {
      setErrorFormulario("Ingresa un año válido.");
      return;
    }
    if (formulario.km_actuales < 0) {
      setErrorFormulario("Los km no pueden ser negativos.");
      return;
    }

    setErrorFormulario(null);
    onConfirmar({ ...formulario, placa, marca, modelo });
  }

  function campo<K extends keyof VehiculoInput>(key: K, valor: VehiculoInput[K]) {
    setFormulario((prev) => ({ ...prev, [key]: valor }));
  }

  const titulo =
    config.modo === "crear" ? "Registrar Vehículo" :
    config.modo === "editar" ? "Editar Vehículo" : "Eliminar Vehículo";

  const textoBoton =
    config.modo === "crear" ? "Guardar Vehículo" :
    config.modo === "editar" ? "Guardar cambios" : "Eliminar";

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={(e) => { if (e.target === e.currentTarget) cerrar(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={cerrar}
          disabled={procesando}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-40 text-lg leading-none"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-gray-900 font-head mb-5">{titulo}</h3>

        {config.modo === "eliminar" ? (
          <p className="text-sm text-gray-600 mb-6">
            ¿Eliminar{" "}
            <span className="font-bold text-gray-900">
              {config.vehiculo.placa} — {config.vehiculo.marca} {config.vehiculo.modelo}
            </span>
            ? Esta acción no se puede deshacer.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Placa</label>
              <input type="text" value={formulario.placa} onChange={(e) => campo("placa", e.target.value)}
                placeholder="ABC-123" disabled={procesando} className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Marca</label>
              <input type="text" value={formulario.marca} onChange={(e) => campo("marca", e.target.value)}
                placeholder="Toyota" disabled={procesando} className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Modelo</label>
              <input type="text" value={formulario.modelo} onChange={(e) => campo("modelo", e.target.value)}
                placeholder="RAV4" disabled={procesando} className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Año</label>
              <input type="number" value={formulario.anio} onChange={(e) => campo("anio", parseInt(e.target.value) || 0)}
                placeholder="2023" disabled={procesando} className={inputClases} />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</label>
              <select value={formulario.tipo} onChange={(e) => campo("tipo", e.target.value as VehiculoInput["tipo"])}
                disabled={procesando} className={inputClases}>
                {TIPOS_VEHICULO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Km actuales</label>
              <input type="number" value={formulario.km_actuales} onChange={(e) => campo("km_actuales", parseInt(e.target.value) || 0)}
                placeholder="15000" disabled={procesando} className={inputClases} />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</label>
              <select value={formulario.estado} onChange={(e) => campo("estado", e.target.value as VehiculoInput["estado"])}
                disabled={procesando} className={inputClases}>
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="NO_DISPONIBLE">NO_DISPONIBLE</option>
              </select>
            </div>
            {errorFormulario && (
              <p className="col-span-2 text-xs text-red-600 font-semibold">{errorFormulario}</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button type="button" onClick={cerrar} disabled={procesando}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-40 transition-colors">
            Cancelar
          </button>
          <button type="button" onClick={confirmar} disabled={procesando}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-40 transition-colors ${
              config.modo === "eliminar"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}>
            {procesando ? "Procesando..." : textoBoton}
          </button>
        </div>
      </div>
    </div>
  );
}
