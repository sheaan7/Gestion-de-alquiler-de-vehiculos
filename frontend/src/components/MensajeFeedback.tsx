interface MensajeFeedbackProps {
  texto: string;
  tipo: "exito" | "error";
  onCerrar?: () => void;
}

export default function MensajeFeedback({ texto, tipo, onCerrar }: MensajeFeedbackProps) {
  const estilos =
    tipo === "exito"
      ? "bg-green-50 text-green-800 border-green-200"
      : "bg-red-50 text-red-800 border-red-200";

  return (
    <div className={`flex items-start justify-between px-4 py-3 rounded-lg text-sm font-medium border ${estilos}`}>
      <span>{texto}</span>
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          className="ml-3 text-current opacity-60 hover:opacity-100 leading-none"
        >
          ✕
        </button>
      )}
    </div>
  );
}
