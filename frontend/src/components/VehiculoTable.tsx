"use client";

import EstadoBadge from "./EstadoBadge";
import { ModalConfig } from "./VehiculoModal";
import { Vehiculo } from "../types/vehiculo";

interface VehiculoTableProps {
  vehiculos: Vehiculo[];
  procesando: string | null;
  onAlquilar: (id: number) => void;
  onAbrirModal: (config: ModalConfig) => void;
}

export default function VehiculoTable({ vehiculos, procesando, onAlquilar, onAbrirModal }: VehiculoTableProps) {
  if (vehiculos.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-400">
        No hay vehículos registrados.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Placa</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Marca / Modelo</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Año</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Km actuales</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vehiculos.map((v) => (
            <tr key={v.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5">
                <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md font-bold">
                  {v.placa}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <span className="font-semibold text-gray-900">{v.marca}</span>{" "}
                <span className="text-gray-500">{v.modelo}</span>
              </td>
              <td className="px-5 py-3.5 text-gray-500">{v.anio}</td>
              <td className="px-5 py-3.5 text-gray-500">{v.tipo}</td>
              <td className="px-5 py-3.5 text-gray-600 font-medium">
                {v.km_actuales.toLocaleString("es-CO")} km
              </td>
              <td className="px-5 py-3.5">
                <EstadoBadge estado={v.estado} />
              </td>
              <td className="px-5 py-3.5">
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onAlquilar(v.id)}
                    disabled={v.estado !== "DISPONIBLE" || procesando === `v-${v.id}`}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {procesando === `v-${v.id}` ? "..." : "Alquilar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onAbrirModal({ modo: "editar", vehiculo: v })}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onAbrirModal({ modo: "eliminar", vehiculo: v })}
                    className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 border border-red-100 transition-colors"
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
  );
}
