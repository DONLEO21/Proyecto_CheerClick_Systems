import { createPortal } from "react-dom";
import { TriangleAlert, CircleCheck, CircleX } from "lucide-react";

// Un icono por tipo de aviso (lucide-react ya está en tu proyecto)
const ICONOS = {
  ok: CircleCheck,
  advertencia: TriangleAlert,
  error: CircleX,
};

export default function AvisoToast({ aviso }) {
  const Icono = ICONOS[aviso.tipo] ?? TriangleAlert;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`aviso-toast aviso-${aviso.tipo} ${aviso.visible ? "visible" : ""}`}
    >
      <Icono className="aviso-toast__icono" size={20} strokeWidth={2.2} aria-hidden="true" />
      <span className="aviso-toast__texto">{aviso.mensaje}</span>
    </div>,
    document.body
  );
}