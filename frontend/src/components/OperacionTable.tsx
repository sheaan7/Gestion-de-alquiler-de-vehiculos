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
    return (
      <p className="py-12 text-center text-sm text-gray-400">
        No hay operaciones registradas.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Operación</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Vehículo</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {operaciones.map((op) => (
            <tr key={op.idOperacion} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5">
                <code className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                  {op.idOperacion}
                </code>
              </td>
              <td className="px-5 py-3.5 text-gray-600 font-medium">{op.idVehiculo}</td>
              <td className="px-5 py-3.5">
                <EstadoBadge estado={op.estado} />
              </td>
              <td className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => onCancelar(op.idOperacion)}
                  disabled={op.estado === "CANCELADA" || procesando === op.idOperacion}
                  className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 border border-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {procesando === op.idOperacion ? "..." : "Cancelar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
