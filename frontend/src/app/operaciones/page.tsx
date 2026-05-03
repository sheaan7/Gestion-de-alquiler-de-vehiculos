"use client";

import { useEffect, useState } from "react";
import { listarOperaciones, cancelarOperacion } from "../../lib/clienteApi";
import { Operacion } from "../../types/vehiculo";
import OperacionTable from "../../components/OperacionTable";
import Spinner from "../../components/Spinner";
import MensajeFeedback from "../../components/MensajeFeedback";

export default function PaginaOperaciones() {
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: "exito" | "error" } | null>(null);

  async function cargar() {
    setCargando(true);
    try {
      setOperaciones(await listarOperaciones());
    } catch (e) {
      setMensaje({ texto: e instanceof Error ? e.message : "Error al cargar", tipo: "error" });
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { void cargar(); }, []);

  async function cancelar(idOperacion: string) {
    setProcesando(idOperacion);
    setMensaje(null);
    try {
      await cancelarOperacion(idOperacion);
      setMensaje({ texto: `Operación ${idOperacion} cancelada`, tipo: "exito" });
      await cargar();
    } catch (e) {
      setMensaje({ texto: e instanceof Error ? e.message : "Error al cancelar", tipo: "error" });
    } finally {
      setProcesando(null);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Operaciones</h1>
        <p className="text-gray-500 text-sm mt-1">Historial de alquileres</p>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {cargando && <Spinner />}
        {!cargando && (
          <OperacionTable
            operaciones={operaciones}
            procesando={procesando}
            onCancelar={cancelar}
          />
        )}
      </div>
    </div>
  );
}
