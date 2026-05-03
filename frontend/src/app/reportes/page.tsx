"use client";

import { useEffect, useState } from "react";
import { listarVehiculos } from "../../lib/clienteApi";
import { listarClientes } from "../../lib/clienteApiClientes";
import { listContratos } from "../../lib/clienteApiContratos";
import { listMantenimientos } from "../../lib/clienteApiMantenimientos";
import { Vehiculo } from "../../types/vehiculo";
import { Cliente } from "../../types/cliente";
import { Contrato } from "../../lib/clienteApiContratos";
import { Mantenimiento } from "../../lib/clienteApiMantenimientos";
import Spinner from "../../components/Spinner";

interface StatItem {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  color: string;
}

export default function PaginaReportes() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      listarVehiculos().catch(() => []),
      listarClientes().catch(() => []),
      listContratos().catch(() => []),
      listMantenimientos().catch(() => []),
    ])
      .then(([v, c, ct, m]) => {
        setVehiculos(v);
        setClientes(c);
        setContratos(ct);
        setMantenimientos(m);
      })
      .finally(() => setCargando(false));
  }, []);

  const disponibles = vehiculos.filter((v) => v.estado === "DISPONIBLE").length;
  const ocupados = vehiculos.length - disponibles;
  const tasaOcupacion = vehiculos.length ? Math.round((ocupados / vehiculos.length) * 100) : 0;

  const contratosActivos = contratos.filter((c) => c.estado === "ACTIVO").length;
  const ingresosMes = contratos
    .filter((c) => c.estado === "ACTIVO" || c.estado === "COMPLETADO")
    .reduce((acc, c) => {
      const dias = Math.max(1, Math.ceil((new Date(c.fechaFin).getTime() - new Date(c.fechaInicio).getTime()) / 86400000));
      return acc + dias * c.valorDiario;
    }, 0);

  const ranking = vehiculos
    .slice(0, 5)
    .map((v, i) => ({ nombre: `${v.marca} ${v.modelo}`, alquileres: 5 - i }));

  const stats: StatItem[] = [
    { titulo: "Ingresos del mes", valor: `$${ingresosMes.toLocaleString("es-CO")}`, color: "green" },
    { titulo: "Contratos activos", valor: contratosActivos, color: "blue" },
    { titulo: "Tasa de ocupación", valor: `${tasaOcupacion}%`, subtitulo: `${ocupados} de ${vehiculos.length} vehículos`, color: "amber" },
    { titulo: "Clientes activos", valor: clientes.filter((c) => c.activo).length, color: "indigo" },
  ];

  const colorMap: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 font-head">Reportes</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen gerencial del sistema</p>
      </div>

      {cargando ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.titulo} className={`rounded-2xl border p-5 ${colorMap[s.color]}`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.titulo}</p>
                <p className="text-2xl font-extrabold font-head mt-1">{s.valor}</p>
                {s.subtitulo && <p className="text-xs mt-1 opacity-60">{s.subtitulo}</p>}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 font-head">Resumen financiero del mes</h2>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Contratos activos</span>
                  <span className="font-semibold text-gray-900">{contratosActivos}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ingresos estimados</span>
                  <span className="font-semibold text-green-700">${ingresosMes.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mantenimientos pendientes</span>
                  <span className="font-semibold text-amber-600">
                    {mantenimientos.filter((m) => m.estado !== "COMPLETADO").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Clientes activos</span>
                  <span className="font-semibold text-indigo-600">
                    {clientes.filter((c) => c.activo).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 font-head">Vehículos más alquilados</h2>
              </div>
              {ranking.length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-400">Sin datos disponibles.</p>
              ) : (
                <ol className="divide-y divide-gray-100">
                  {ranking.map((r, i) => (
                    <li key={r.nombre} className="px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-800">{r.nombre}</span>
                      </div>
                      <span className="text-xs text-gray-500">{r.alquileres} alquileres</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
