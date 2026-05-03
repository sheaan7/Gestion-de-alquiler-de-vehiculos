interface SpinnerProps {
  mensaje?: string;
}

export default function Spinner({ mensaje = "Cargando..." }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3" />
      <p className="text-sm text-gray-500">{mensaje}</p>
    </div>
  );
}
