"use client";

import { useCallback, useEffect, useState } from "react";
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

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setOperaciones(await listarOperaciones());
    } catch (e) {
      setMensaje({ texto: e instanceof Error ? e.message : "Error al cargar", tipo: "error" });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  async function cancelar(idOperacion: string) {
    setProcesando(idOperacion);
    setMensaje(null);
    try {
      await cancelarOperacion(idOperacion);
      setMensaje({ texto: "Operación cancelada exitosamente", tipo: "exito" });
      await cargar();
    } catch (e) {
      setMensaje({ texto: e instanceof Error ? e.message : "Error al cancelar", tipo: "error" });
    } finally {
      setProcesando(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 font-head">Operaciones</h1>
          <p className="text-gray-500 text-sm mt-1">Historial de alquileres</p>
        </div>
        <button
          type="button"
          onClick={() => void cargar()}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Actualizar
        </button>
      </div>

      {mensaje && (
        <div className="mb-4">
          <MensajeFeedback texto={mensaje.texto} tipo={mensaje.tipo} onCerrar={() => setMensaje(null)} />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 font-head">Registro de alquileres</h2>
        </div>
        {cargando ? (
          <Spinner />
        ) : (
          <OperacionTable operaciones={operaciones} procesando={procesando} onCancelar={cancelar} />
        )}
      </div>
    </div>
  );
}
