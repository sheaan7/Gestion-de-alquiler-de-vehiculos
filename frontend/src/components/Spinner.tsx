interface SpinnerProps {
  mensaje?: string;
}

export default function Spinner({ mensaje = "Cargando..." }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-9 h-9 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-400">{mensaje}</p>
    </div>
  );
}
