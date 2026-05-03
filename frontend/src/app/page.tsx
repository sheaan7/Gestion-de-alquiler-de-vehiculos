"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarVehiculos, listarOperaciones } from "../lib/clienteApi";
import { Vehiculo, Operacion } from "../types/vehiculo";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import EstadoBadge from "../components/EstadoBadge";

export default function Dashboard() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const [v, o] = await Promise.all([listarVehiculos(), listarOperaciones()]);
        setVehiculos(v);
        setOperaciones(o);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al cargar datos");
      } finally {
        setCargando(false);
      }
    }
    void cargar();
  }, []);

  const disponibles = vehiculos.filter((v) => v.estado === "DISPONIBLE").length;
  const confirmadas = operaciones.filter((o) => o.estado === "CONFIRMADA").length;

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard titulo="Vehículos en flota" valor={vehiculos.length} color="blue" />
            <StatCard titulo="Disponibles" valor={disponibles} color="green" />
            <StatCard titulo="No disponibles" valor={vehiculos.length - disponibles} color="indigo" />
            <StatCard titulo="Alquileres activos" valor={confirmadas} color="amber" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Vehículos */}
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

            {/* Operaciones */}
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
          </div>
        </>
      )}
    </div>
  );
}
