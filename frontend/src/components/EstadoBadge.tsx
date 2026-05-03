import { EstadoVehiculo } from "../types/vehiculo";

type EstadoOperacion = "CONFIRMADA" | "CANCELADA";

interface EstadoBadgeProps {
  estado: EstadoVehiculo | EstadoOperacion;
}

const COLORES: Record<string, string> = {
  DISPONIBLE: "bg-green-100 text-green-700",
  NO_DISPONIBLE: "bg-gray-100 text-gray-500",
  CONFIRMADA: "bg-blue-100 text-blue-700",
  CANCELADA: "bg-gray-100 text-gray-400",
};

export default function EstadoBadge({ estado }: EstadoBadgeProps) {
  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${COLORES[estado] ?? "bg-gray-100 text-gray-500"}`}>
      {estado}
    </span>
  );
}
