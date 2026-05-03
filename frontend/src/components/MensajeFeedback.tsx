interface MensajeFeedbackProps {
  texto: string;
  tipo: "exito" | "error";
  onCerrar?: () => void;
}

export default function MensajeFeedback({ texto, tipo, onCerrar }: MensajeFeedbackProps) {
  const clases =
    tipo === "exito"
      ? "bg-green-50 text-green-800 border-green-200"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className={`flex items-start justify-between px-4 py-3 rounded-xl text-sm font-medium border ${clases}`}>
      <span>{texto}</span>
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          className="ml-3 opacity-50 hover:opacity-100 transition-opacity leading-none"
        >
          ✕
        </button>
      )}
    </div>
  );
}
