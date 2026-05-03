interface EstadoBadgeProps {
  estado: string;
}

const CONFIG: Record<string, { label: string; clases: string }> = {
  // Vehículo
  DISPONIBLE:    { label: "Disponible",    clases: "bg-green-100 text-green-700 border border-green-200" },
  NO_DISPONIBLE: { label: "No disponible", clases: "bg-blue-100 text-blue-600 border border-blue-200" },
  // Operación
  CONFIRMADA:    { label: "Confirmada",    clases: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  CANCELADA:     { label: "Cancelada",     clases: "bg-gray-100 text-gray-500 border border-gray-200" },
  // Contrato / Reserva
  ACTIVO:        { label: "Activo",        clases: "bg-green-100 text-green-700 border border-green-200" },
  VENCIDO:       { label: "Vencido",       clases: "bg-red-100 text-red-600 border border-red-200" },
  PENDIENTE:     { label: "Pendiente",     clases: "bg-amber-100 text-amber-700 border border-amber-200" },
  COMPLETADO:    { label: "Completado",    clases: "bg-indigo-100 text-indigo-700 border border-indigo-200" },
  // Mantenimiento
  PROGRAMADO:    { label: "Programado",    clases: "bg-sky-100 text-sky-700 border border-sky-200" },
  EN_PROCESO:    { label: "En proceso",    clases: "bg-orange-100 text-orange-700 border border-orange-200" },
};

export default function EstadoBadge({ estado }: EstadoBadgeProps) {
  const cfg = CONFIG[estado] ?? { label: estado, clases: "bg-gray-100 text-gray-500 border border-gray-200" };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.clases}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}
