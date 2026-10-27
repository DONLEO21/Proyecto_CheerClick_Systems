import { useEffect, useState } from "react";
import AsistenciaJustificaciones from "../../../pages/Admin/Asistencia/AsistenciaJustificaciones";
import { obtenerNiveles } from "../../../services/asistenciaService";
import { ENTRENADOR_ACTUAL } from "../../../services/AtletaActual";

export default function Asistencia() {
  const [niveles, setNiveles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerNiveles()
      .then((data) =>
        setNiveles(
          data.filter((n) => !n.inhabilitado && n.entrenador === ENTRENADOR_ACTUAL.nombre)
        )
      )
      .catch(() =>
        setError("No se pudo conectar con el servidor de datos. Verifica que json-server esté corriendo (npm run server).")
      )
      .finally(() => setCargando(false));
  }, []);

  if (error) {
    return (
      <div className="p-4">
        <h1>Asistencia</h1>
        <p className="asist-error">{error}</p>
      </div>
    );
  }

  if (cargando) {
    return (
      <div className="p-4">
        <p>Cargando tu nivel asignado…</p>
      </div>
    );
  }

  if (niveles.length === 0) {
    return (
      <div className="p-4">
        <h1>Asistencia</h1>
        <p>Aún no tienes un nivel asignado como entrenador.</p>
      </div>
    );
  }

  return (
    <AsistenciaJustificaciones
      niveles={niveles}
      subtitulo={
        niveles.length > 1
          ? "Asistencia de tus niveles asignados."
          : "Asistencia de tu nivel asignado."
      }
    />
  );
}
