"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarVehiculos, listarOperaciones } from "../lib/clienteApi";
import { Vehiculo, Operacion } from "../types/vehiculo";
import StatCard from "../components/StatCard";
import Spinner from "../components/Spinner";
import MensajeFeedback from "../components/MensajeFeedback";
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

  if (cargando) return <Spinner mensaje="Cargando dashboard..." />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
        <p className="text-gray-500 mt-1">Resumen del sistema de alquiler de automóviles</p>
      </div>

      {error && (
        <div className="mb-6">
          <MensajeFeedback texto={error} tipo="error" onCerrar={() => setError(null)} />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard titulo="Total Vehículos" valor={vehiculos.length} color="blue" />
        <StatCard titulo="Disponibles" valor={disponibles} color="green" />
        <StatCard titulo="No Disponibles" valor={vehiculos.length - disponibles} color="gray" />
        <StatCard titulo="Alquileres Activos" valor={confirmadas} color="red" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">Últimos vehículos</h2>
            <Link href="/vehiculos" className="text-xs text-blue-600 hover:underline">Ver todos</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {vehiculos.slice(0, 5).map((v) => (
              <div key={v.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{v.marca} {v.modelo}</p>
                  <p className="text-xs text-gray-400">ID: {v.id}</p>
                </div>
                <EstadoBadge estado={v.estado} />
              </div>
            ))}
            {vehiculos.length === 0 && (
              <p className="px-6 py-6 text-sm text-gray-400 text-center">Sin vehículos</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">Últimas operaciones</h2>
            <Link href="/operaciones" className="text-xs text-blue-600 hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {operaciones.slice(0, 5).map((o) => (
              <div key={o.idOperacion} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-gray-500">{o.idOperacion}</p>
                  <p className="text-xs text-gray-400">Vehículo ID: {o.idVehiculo}</p>
                </div>
                <EstadoBadge estado={o.estado} />
              </div>
            ))}
            {operaciones.length === 0 && (
              <p className="px-6 py-6 text-sm text-gray-400 text-center">Sin operaciones</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
