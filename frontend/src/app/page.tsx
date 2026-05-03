"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarVehiculos, listarOperaciones } from "../lib/clienteApi";
import { listarClientes } from "../lib/clienteApiClientes";
import { listContratos } from "../lib/clienteApiContratos";
import { listReservas } from "../lib/clienteApiReservas";
import { Vehiculo, Operacion } from "../types/vehiculo";
import { Cliente } from "../types/cliente";
import { Contrato } from "../lib/clienteApiContratos";
import { Reserva } from "../lib/clienteApiReservas";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import EstadoBadge from "../components/EstadoBadge";

export default function Dashboard() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const [resV, resO, resC, resCt, resR] = await Promise.allSettled([
          listarVehiculos(),
          listarOperaciones(),
          listarClientes(),
          listContratos(),
          listReservas(),
        ]);
        if (resV.status === "fulfilled") setVehiculos(resV.value);
        else setError(resV.reason instanceof Error ? resV.reason.message : "Error al cargar vehículos");
        if (resO.status === "fulfilled") setOperaciones(resO.value);
        if (resC.status === "fulfilled") setClientes(resC.value);
        if (resCt.status === "fulfilled") setContratos(resCt.value);
        if (resR.status === "fulfilled") setReservas(resR.value);
      } finally {
        setCargando(false);
      }
    }
    void cargar();
  }, []);

  const disponibles = vehiculos.filter((v) => v.estado === "DISPONIBLE").length;
  const confirmadas = operaciones.filter((o) => o.estado === "CONFIRMADA").length;
  const clientesActivos = clientes.filter((c) => c.activo).length;
  const contratosActivos = contratos.filter((c) => c.estado === "ACTIVO").length;
  const reservasPendientes = reservas.filter((r) => r.estado === "PENDIENTE").length;
  const contratosProximos = contratos.filter((c) => {
    const fin = new Date(c.fechaFin);
    const diff = (fin.getTime() - Date.now()) / 86400000;
    return c.estado === "ACTIVO" && diff >= 0 && diff <= 5;
  }).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 font-head">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Resumen del sistema de alquiler de automóviles</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {cargando ? (
        <Spinner mensaje="Cargando dashboard..." />
      ) : (
        <>
          {contratosProximos > 0 && (
            <div className="mb-6 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
              <span>⚠</span>
              <span>{contratosProximos} contrato{contratosProximos > 1 ? "s vencen" : " vence"} en los próximos 5 días</span>
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <StatCard titulo="Vehículos en flota" valor={vehiculos.length} color="blue" />
            <StatCard titulo="Disponibles" valor={disponibles} color="green" />
            <StatCard titulo="No disponibles" valor={vehiculos.length - disponibles} color="indigo" />
            <StatCard titulo="Alquileres activos" valor={confirmadas} color="amber" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard titulo="Clientes activos" valor={clientesActivos} color="blue" />
            <StatCard titulo="Contratos activos" valor={contratosActivos} color="amber" />
            <StatCard titulo="Reservas pendientes" valor={reservasPendientes} color="indigo" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800 font-head">Flota reciente</h2>
                <Link href="/vehiculos" className="text-xs text-blue-600 font-semibold hover:underline">
                  Ver todos →
                </Link>
              </div>
              {vehiculos.length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-400">Sin vehículos registrados</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {vehiculos.slice(0, 5).map((v) => (
                    <div key={v.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{v.marca} {v.modelo}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{v.placa}</span>
                          {" · "}{v.anio} · {v.tipo}
                        </p>
                      </div>
                      <EstadoBadge estado={v.estado} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800 font-head">Operaciones recientes</h2>
                <Link href="/operaciones" className="text-xs text-blue-600 font-semibold hover:underline">
                  Ver todas →
                </Link>
              </div>
              {operaciones.length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-400">Sin operaciones registradas</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {operaciones.slice(0, 5).map((o) => (
                    <div key={o.idOperacion} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <code className="text-xs text-gray-400">{o.idOperacion.slice(0, 20)}…</code>
                        <p className="text-xs text-gray-500 mt-0.5">Vehículo #{o.idVehiculo}</p>
                      </div>
                      <EstadoBadge estado={o.estado} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800 font-head">Contratos activos</h2>
                <Link href="/contratos" className="text-xs text-blue-600 font-semibold hover:underline">
                  Ver todos →
                </Link>
              </div>
              {contratos.filter((c) => c.estado === "ACTIVO").length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-400">Sin contratos activos</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {contratos.filter((c) => c.estado === "ACTIVO").slice(0, 4).map((c) => (
                    <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{c.nombreCliente}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{c.placa}</span>
                          {" · "}hasta {c.fechaFin}
                        </p>
                      </div>
                      <EstadoBadge estado={c.estado} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-800 font-head">Reservas pendientes</h2>
                <Link href="/reservas" className="text-xs text-blue-600 font-semibold hover:underline">
                  Ver todas →
                </Link>
              </div>
              {reservas.filter((r) => r.estado === "PENDIENTE").length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-400">Sin reservas pendientes</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {reservas.filter((r) => r.estado === "PENDIENTE").slice(0, 4).map((r) => (
                    <div key={r.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{r.nombreCliente}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{r.placa}</span>
                          {" · "}desde {r.fechaInicio}
                        </p>
                      </div>
                      <EstadoBadge estado={r.estado} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

