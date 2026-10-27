import { useEffect, useState } from "react";
import AsistenciaJustificaciones from "./AsistenciaJustificaciones";
import { obtenerNiveles } from "../../../services/asistenciaService";

export default function Asistencia() {
  const [niveles, setNiveles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerNiveles()
      .then((data) => setNiveles(data.filter((n) => !n.inhabilitado)))
      .catch(() =>
        setError("No se pudo conectar con el servidor de datos.")
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
        <p>Cargando niveles…</p>
      </div>
    );
  }

  return <AsistenciaJustificaciones niveles={niveles} />;
}