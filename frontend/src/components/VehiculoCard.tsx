import Link from "next/link";
import EstadoBadge from "./EstadoBadge";
import { Vehiculo } from "../types/vehiculo";

interface VehiculoCardProps {
  vehiculo: Vehiculo;
  onAlquilar?: (id: number) => void;
  procesando?: boolean;
}

export default function VehiculoCard({ vehiculo, onAlquilar, procesando }: VehiculoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-900 text-base font-head">
            {vehiculo.marca} {vehiculo.modelo}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{vehiculo.anio} · {vehiculo.tipo}</p>
        </div>
        <EstadoBadge estado={vehiculo.estado} />
      </div>

      <div className="flex gap-4 text-sm">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Placa</p>
          <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md font-semibold">
            {vehiculo.placa}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Km</p>
          <p className="text-sm font-semibold text-gray-700">
            {vehiculo.km_actuales.toLocaleString("es-CO")}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-auto">
        <Link
          href={`/vehiculos/${vehiculo.id}`}
          className="flex-1 text-center px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          Ver detalle
        </Link>
        {onAlquilar && (
          <button
            type="button"
            onClick={() => onAlquilar(vehiculo.id)}
            disabled={vehiculo.estado !== "DISPONIBLE" || procesando}
            className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {procesando ? "..." : "Alquilar"}
          </button>
        )}
      </div>
    </div>
  );
}
