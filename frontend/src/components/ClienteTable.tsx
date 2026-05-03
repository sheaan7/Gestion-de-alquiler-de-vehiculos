"use client";

import { Cliente } from "../types/cliente";
import { ModalConfig } from "./ClienteModal";

interface ClienteTableProps {
  clientes: Cliente[];
  procesando: string | null;
  onAbrirModal: (config: ModalConfig) => void;
}

export default function ClienteTable({ clientes, procesando, onAbrirModal }: ClienteTableProps) {
  if (clientes.length === 0) {
    return (
      <p className="px-6 py-12 text-center text-sm text-gray-400">
        No hay clientes registrados.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-5 py-3 text-left">Nombre</th>
            <th className="px-5 py-3 text-left">Cédula / NIT</th>
            <th className="px-5 py-3 text-left">Teléfono</th>
            <th className="px-5 py-3 text-left">Email</th>
            <th className="px-5 py-3 text-left">Tipo</th>
            <th className="px-5 py-3 text-left">Estado</th>
            <th className="px-5 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {clientes.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3 font-medium text-gray-900">{c.nombre}</td>
              <td className="px-5 py-3 text-gray-500 font-mono text-xs">{c.cedulaNit}</td>
              <td className="px-5 py-3 text-gray-600">{c.telefono}</td>
              <td className="px-5 py-3 text-gray-600">{c.email}</td>
              <td className="px-5 py-3 text-gray-500">{c.tipoCliente}</td>
              <td className="px-5 py-3">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                  c.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {c.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onAbrirModal({ modo: "editar", cliente: c })}
                    disabled={procesando === `c-${c.id}`}
                    className="px-2.5 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-40 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onAbrirModal({ modo: "eliminar", cliente: c })}
                    disabled={procesando === `c-${c.id}`}
                    className="px-2.5 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40 transition-colors"
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
