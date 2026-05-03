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
    return <p className="px-6 py-10 text-center text-gray-400 text-sm">No hay vehículos registrados.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left">ID</th>
            <th className="px-6 py-3 text-left">Marca</th>
            <th className="px-6 py-3 text-left">Modelo</th>
            <th className="px-6 py-3 text-left">Estado</th>
            <th className="px-6 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-400">{vehiculo.id}</td>
              <td className="px-6 py-4 font-medium text-gray-800">{vehiculo.marca}</td>
              <td className="px-6 py-4 text-gray-600">{vehiculo.modelo}</td>
              <td className="px-6 py-4"><EstadoBadge estado={vehiculo.estado} /></td>
              <td className="px-6 py-4">
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onAlquilar(vehiculo.id)}
                    disabled={vehiculo.estado !== "DISPONIBLE" || procesando === `v-${vehiculo.id}`}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {procesando === `v-${vehiculo.id}` ? "Procesando..." : "Alquilar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onAbrirModal({ modo: "editar", vehiculo })}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onAbrirModal({ modo: "eliminar", vehiculo })}
                    className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors"
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
