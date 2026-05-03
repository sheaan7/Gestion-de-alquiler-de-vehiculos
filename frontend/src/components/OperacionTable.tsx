"use client";

import EstadoBadge from "./EstadoBadge";
import { Operacion } from "../types/vehiculo";

interface OperacionTableProps {
  operaciones: Operacion[];
  procesando: string | null;
  onCancelar: (id: string) => void;
}

export default function OperacionTable({ operaciones, procesando, onCancelar }: OperacionTableProps) {
  if (operaciones.length === 0) {
    return <p className="px-6 py-10 text-center text-gray-400 text-sm">No hay operaciones registradas.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-3 text-left">ID Operación</th>
            <th className="px-6 py-3 text-left">ID Vehículo</th>
            <th className="px-6 py-3 text-left">Estado</th>
            <th className="px-6 py-3 text-left">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {operaciones.map((op) => (
            <tr key={op.idOperacion} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-mono text-gray-400 text-xs">{op.idOperacion}</td>
              <td className="px-6 py-4 text-gray-600">{op.idVehiculo}</td>
              <td className="px-6 py-4"><EstadoBadge estado={op.estado} /></td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onCancelar(op.idOperacion)}
                  disabled={op.estado === "CANCELADA" || procesando === op.idOperacion}
                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {procesando === op.idOperacion ? "Procesando..." : "Cancelar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
