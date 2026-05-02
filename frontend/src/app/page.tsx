"use client";

import { useEffect, useState } from "react";
import { alquilarVehiculo, cancelarOperacion, listarOperaciones, listarVehiculos } from "../lib/clienteApi";
import { Operacion, Vehiculo } from "../types/vehiculo";

export default function PaginaInicio() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [mensaje, setMensaje] = useState("");

  async function cargarVehiculos() {
    try {
      const datosVehiculos = await listarVehiculos();
      setVehiculos(datosVehiculos);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Error al cargar");
    }
  }

  async function cargarOperaciones() {
    try {
      const datosOperaciones = await listarOperaciones();
      setOperaciones(datosOperaciones);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Error al consultar operaciones");
    }
  }

  async function alquilar(idVehiculo: number) {
    try {
      const operacion = await alquilarVehiculo(idVehiculo);
      setMensaje(`Operacion ${operacion.idOperacion} confirmada`);
      await cargarVehiculos();
      await cargarOperaciones();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Error al alquilar");
    }
  }

  async function cancelar(idOperacion: string) {
    try {
      await cancelarOperacion(idOperacion);
      setMensaje(`Operacion ${idOperacion} cancelada`);
      await cargarVehiculos();
      await cargarOperaciones();
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : "Error al cancelar");
    }
  }

  useEffect(() => {
    void cargarVehiculos();
    void cargarOperaciones();
  }, []);

  return (
    <main style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
      <h1>Sistema de alquiler de vehiculos</h1>
      {mensaje && <p>{mensaje}</p>}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Estado</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id}>
              <td>{vehiculo.id}</td>
              <td>{vehiculo.marca}</td>
              <td>{vehiculo.modelo}</td>
              <td>{vehiculo.estado}</td>
              <td>
                <button
                  type="button"
                  onClick={() => void alquilar(vehiculo.id)}
                  disabled={vehiculo.estado !== "DISPONIBLE"}
                >
                  Alquilar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={{ marginTop: "2rem" }}>Operaciones</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID Operacion</th>
            <th>ID Vehiculo</th>
            <th>Estado</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {operaciones.map((operacion) => (
            <tr key={operacion.idOperacion}>
              <td>{operacion.idOperacion}</td>
              <td>{operacion.idVehiculo}</td>
              <td>{operacion.estado}</td>
              <td>
                <button
                  type="button"
                  onClick={() => void cancelar(operacion.idOperacion)}
                  disabled={operacion.estado === "CANCELADA"}
                >
                  Cancelar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
