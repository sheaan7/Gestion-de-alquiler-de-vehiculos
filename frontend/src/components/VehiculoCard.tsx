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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-800 text-base">{vehiculo.marca} {vehiculo.modelo}</p>
          <p className="text-xs text-gray-400 mt-0.5">ID: {vehiculo.id}</p>
        </div>
        <EstadoBadge estado={vehiculo.estado} />
      </div>
      <div className="flex gap-2 mt-auto">
        <Link
          href={`/vehiculos/${vehiculo.id}`}
          className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Ver detalle
        </Link>
        {onAlquilar && (
          <button
            type="button"
            onClick={() => onAlquilar(vehiculo.id)}
            disabled={vehiculo.estado !== "DISPONIBLE" || procesando}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {procesando ? "..." : "Alquilar"}
          </button>
        )}
      </div>
    </div>
  );
}
