"use client";

import { useEffect, useState } from "react";
import { Vehiculo, VehiculoInput } from "../types/vehiculo";

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
  marca: "",
  modelo: "",
  estado: "DISPONIBLE",
};

export default function VehiculoModal({
  config,
  procesando,
  onConfirmar,
  onCerrar,
}: VehiculoModalProps) {
  const [formulario, setFormulario] = useState<VehiculoInput>(FORMULARIO_VACIO);
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

  useEffect(() => {
    if (config.modo === "editar") {
      setFormulario({
        marca: config.vehiculo.marca,
        modelo: config.vehiculo.modelo,
        estado: config.vehiculo.estado,
      });
      return;
    }
    setFormulario(FORMULARIO_VACIO);
  }, [config]);

  function cerrar() {
    if (procesando) {
      return;
    }
    setErrorFormulario(null);
    onCerrar();
  }

  function confirmar() {
    if (config.modo === "eliminar") {
      onConfirmar();
      return;
    }

    const marca = formulario.marca.trim();
    const modelo = formulario.modelo.trim();
    if (!marca || !modelo) {
      setErrorFormulario("Marca y modelo son obligatorios.");
      return;
    }

    setErrorFormulario(null);
    onConfirmar({
      marca,
      modelo,
      estado: formulario.estado,
    });
  }

  const titulo =
    config.modo === "crear"
      ? "Nuevo Vehículo"
      : config.modo === "editar"
      ? "Editar Vehículo"
      : "Eliminar Vehículo";

  const textoBoton =
    config.modo === "crear"
      ? "Crear"
      : config.modo === "editar"
      ? "Guardar cambios"
      : "Eliminar";

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) {
          cerrar();
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md p-6 relative">
        <button
          type="button"
          onClick={cerrar}
          disabled={procesando}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 disabled:opacity-40"
          aria-label="Cerrar modal"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{titulo}</h3>

        {config.modo === "eliminar" ? (
          <p className="text-sm text-gray-700 mb-6">
            ¿Eliminar {config.vehiculo.marca} {config.vehiculo.modelo}?
          </p>
        ) : (
          <div className="space-y-4 mb-6">
            <label className="block text-sm">
              <span className="text-gray-700 font-medium">Marca</span>
              <input
                type="text"
                value={formulario.marca}
                onChange={(evento) =>
                  setFormulario((previo) => ({ ...previo, marca: evento.target.value }))
                }
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                disabled={procesando}
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-700 font-medium">Modelo</span>
              <input
                type="text"
                value={formulario.modelo}
                onChange={(evento) =>
                  setFormulario((previo) => ({ ...previo, modelo: evento.target.value }))
                }
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                disabled={procesando}
              />
            </label>
            <label className="block text-sm">
              <span className="text-gray-700 font-medium">Estado</span>
              <select
                value={formulario.estado}
                onChange={(evento) =>
                  setFormulario((previo) => ({
                    ...previo,
                    estado: evento.target.value as VehiculoInput["estado"],
                  }))
                }
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                disabled={procesando}
              >
                <option value="DISPONIBLE">DISPONIBLE</option>
                <option value="NO_DISPONIBLE">NO_DISPONIBLE</option>
              </select>
            </label>
            {errorFormulario && (
              <p className="text-xs text-red-600 font-medium">{errorFormulario}</p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={cerrar}
            disabled={procesando}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmar}
            disabled={procesando}
            className={`px-3 py-2 text-sm rounded-lg text-white disabled:opacity-40 ${
              config.modo === "eliminar"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {procesando ? "Procesando..." : textoBoton}
          </button>
        </div>
      </div>
    </div>
  );
}
