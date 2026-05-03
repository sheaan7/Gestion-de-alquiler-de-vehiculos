interface StatCardProps {
  titulo: string;
  valor: number | string;
  subtitulo?: string;
  color?: "blue" | "green" | "indigo" | "amber";
}

const COLOR: Record<string, { border: string; text: string; bg: string }> = {
  blue:   { border: "border-t-blue-500",   text: "text-blue-600",   bg: "bg-blue-50" },
  green:  { border: "border-t-green-500",  text: "text-green-600",  bg: "bg-green-50" },
  indigo: { border: "border-t-indigo-500", text: "text-indigo-600", bg: "bg-indigo-50" },
  amber:  { border: "border-t-amber-500",  text: "text-amber-600",  bg: "bg-amber-50" },
};

export default function StatCard({ titulo, valor, subtitulo, color = "blue" }: StatCardProps) {
  const c = COLOR[color];
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 border-t-4 ${c.border} p-5`}>
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">{titulo}</p>
      <p className={`text-4xl font-extrabold font-head ${c.text}`}>{valor}</p>
      {subtitulo && <p className="text-xs text-gray-400 mt-1.5">{subtitulo}</p>}
    </div>
  );
}
