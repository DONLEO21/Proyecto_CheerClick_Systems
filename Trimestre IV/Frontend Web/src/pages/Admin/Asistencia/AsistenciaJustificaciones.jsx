import { useCallback, useEffect, useState } from "react";
import AsistenciaPanel from "./AsistenciaPanel";
import JustificacionesPanel from "./JustificacionPanel";
import { obtenerJustificaciones } from "../../../services/justificacionesService";
import "./Asistencia.css";

export default function AsistenciaJustificaciones({ niveles = [], subtitulo }) {
  const [vista, setVista] = useState("asistencia"); // "asistencia" | "justificaciones"
  const [pendientes, setPendientes] = useState(0);

  const nivelIds = niveles.map((n) => String(n.id));

  const actualizarConteoPendientes = useCallback(() => {
    if (nivelIds.length === 0) {
      setPendientes(0);
      return;
    }
    obtenerJustificaciones()
      .then((data) => {
        const propias = data.filter((j) => nivelIds.includes(String(j.nivelId)));
        setPendientes(propias.filter((j) => j.estado === "pendiente").length);
      })
      .catch(() => setPendientes(0));
  }, [niveles.map((n) => n.id).join(",")]);

  useEffect(() => {
    actualizarConteoPendientes();
  }, [actualizarConteoPendientes]);

  return (
    <div className="p-4">
      <div className="vista-switch">
        <button
          type="button"
          className={`vista-btn${vista === "asistencia" ? " vista-btn-activo" : ""}`}
          onClick={() => setVista("asistencia")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          Tomar asistencia
        </button>
        <button
          type="button"
          className={`vista-btn${vista === "justificaciones" ? " vista-btn-activo" : ""}`}
          onClick={() => setVista("justificaciones")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          Justificaciones
        </button>
      </div>

      {vista === "asistencia" ? (
        <AsistenciaPanel niveles={niveles} subtitulo={subtitulo} />
      ) : (
        <JustificacionesPanel
          niveles={niveles}
          onCambio={actualizarConteoPendientes}
        />
      )}
    </div>
  );
}