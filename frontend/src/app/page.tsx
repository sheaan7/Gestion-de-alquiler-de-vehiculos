"use client";

import { useEffect, useState } from "react";
import {
  alquilarVehiculo,
  cancelarOperacion,
  listarOperaciones,
  listarVehiculos,
} from "../lib/clienteApi";
import { Operacion, Vehiculo } from "../types/vehiculo";

type Mensaje = { texto: string; tipo: "exito" | "error" };

export default function PaginaInicio() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);

  async function cargarDatos() {
    try {
      const [datosVehiculos, datosOperaciones] = await Promise.all([
        listarVehiculos(),
        listarOperaciones(),
      ]);
      setVehiculos(datosVehiculos);
      setOperaciones(datosOperaciones);
    } catch (error) {
      setMensaje({
        texto: error instanceof Error ? error.message : "Error al cargar datos",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  }

  async function alquilar(idVehiculo: number) {
    const clave = `v-${idVehiculo}`;
    setProcesando(clave);
    setMensaje(null);
    try {
      const operacion = await alquilarVehiculo(idVehiculo);
      setMensaje({
        texto: `Operación ${operacion.idOperacion} confirmada`,
        tipo: "exito",
      });
      await cargarDatos();
    } catch (error) {
      setMensaje({
        texto: error instanceof Error ? error.message : "Error al alquilar",
        tipo: "error",
      });
    } finally {
      setProcesando(null);
    }
  }

  async function cancelar(idOperacion: string) {
    setProcesando(idOperacion);
    setMensaje(null);
    try {
      await cancelarOperacion(idOperacion);
      setMensaje({
        texto: `Operación ${idOperacion} cancelada`,
        tipo: "exito",
      });
      await cargarDatos();
    } catch (error) {
      setMensaje({
        texto: error instanceof Error ? error.message : "Error al cancelar",
        tipo: "error",
      });
    } finally {
      setProcesando(null);
    }
  }

  useEffect(() => {
    void cargarDatos();
  }, []);

  if (cargando) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Sistema de Alquiler de Vehículos
      </h1>

      {mensaje && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium border ${
            mensaje.tipo === "exito"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <section className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700">Vehículos</h2>
        </div>
        {vehiculos.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-400">
            No hay vehículos registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Marca</th>
                  <th className="px-6 py-3 text-left">Modelo</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                  <th className="px-6 py-3 text-left">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehiculos.map((vehiculo) => (
                  <tr
                    key={vehiculo.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-400">{vehiculo.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {vehiculo.marca}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {vehiculo.modelo}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          vehiculo.estado === "DISPONIBLE"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {vehiculo.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => void alquilar(vehiculo.id)}
                        disabled={
                          vehiculo.estado !== "DISPONIBLE" ||
                          procesando === `v-${vehiculo.id}`
                        }
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {procesando === `v-${vehiculo.id}`
                          ? "Procesando..."
                          : "Alquilar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700">Operaciones</h2>
        </div>
        {operaciones.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-400">
            No hay operaciones registradas.
          </p>
        ) : (
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
                {operaciones.map((operacion) => (
                  <tr
                    key={operacion.idOperacion}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-gray-400 text-xs">
                      {operacion.idOperacion}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {operacion.idVehiculo}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                          operacion.estado === "CONFIRMADA"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {operacion.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => void cancelar(operacion.idOperacion)}
                        disabled={
                          operacion.estado === "CANCELADA" ||
                          procesando === operacion.idOperacion
                        }
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {procesando === operacion.idOperacion
                          ? "Procesando..."
                          : "Cancelar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
