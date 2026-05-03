interface StatCardProps {
  titulo: string;
  valor: number | string;
  descripcion?: string;
  color?: "blue" | "green" | "gray" | "red";
}

const COLOR_CLASES: Record<string, string> = {
  blue: "border-t-blue-500",
  green: "border-t-green-500",
  gray: "border-t-gray-400",
  red: "border-t-red-500",
};

export default function StatCard({ titulo, valor, descripcion, color = "blue" }: StatCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 ${COLOR_CLASES[color]} p-5`}>
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{titulo}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{valor}</p>
      {descripcion && <p className="text-xs text-gray-400 mt-1">{descripcion}</p>}
    </div>
  );
}
