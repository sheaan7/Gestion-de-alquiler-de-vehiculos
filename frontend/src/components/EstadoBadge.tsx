interface EstadoBadgeProps {
  estado: string;
}

const CONFIG: Record<string, { label: string; clases: string }> = {
  DISPONIBLE:    { label: "Disponible",    clases: "bg-green-100 text-green-700 border border-green-200" },
  NO_DISPONIBLE: { label: "No disponible", clases: "bg-blue-100 text-blue-600 border border-blue-200" },
  CONFIRMADA:    { label: "Confirmada",    clases: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  CANCELADA:     { label: "Cancelada",     clases: "bg-gray-100 text-gray-500 border border-gray-200" },
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
