// src/hooks/useAviso.js
import { useCallback, useEffect, useRef, useState } from "react";

const DURACION_MS = 3000;

export default function useAviso() {
  const [aviso, setAviso] = useState({ mensaje: "", tipo: "ok", visible: false });
  const temporizador = useRef(null);

  const mostrarAviso = useCallback((mensaje, tipo = "ok") => {
    clearTimeout(temporizador.current);
    setAviso({ mensaje, tipo, visible: true });
    temporizador.current = setTimeout(() => {
      // Se conserva el mensaje para que no desaparezca el texto durante el fade-out
      setAviso((prev) => ({ ...prev, visible: false }));
    }, DURACION_MS);
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  return [aviso, mostrarAviso];
}
