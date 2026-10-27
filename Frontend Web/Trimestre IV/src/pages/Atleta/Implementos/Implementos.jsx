import { useEffect, useState } from "react";
import CatalogoImplementos from "./CatalogoImplementos";
import MisSolicitudes from "./MisSolicitudes";
import AvisoToast from "../../../components/Compartidos/AvisoToast";
import "./Implementos.css";

export default function Implementos() {
  // ── Aviso / toast ────────────────────────────────────────
  const [aviso, setAviso] = useState({ visible: false, mensaje: "", tipo: "ok" });

  useEffect(() => {
    if (!aviso.visible) return;
    const id = setTimeout(() => setAviso((a) => ({ ...a, visible: false })), 3000);
    return () => clearTimeout(id);
  }, [aviso.visible, aviso.mensaje]);

  const mostrarAviso = (mensaje, tipo = "ok") => setAviso({ visible: true, mensaje, tipo });

  const [pestana, setPestana] = useState("catalogo"); // "catalogo" | "solicitudes"

  return (
    <div className="pagina-implementos">
      <h1>Implementos Deportivos</h1>
      <p>Solicite sus productos y reclámelos en el club.</p>

      <div className="contenedor-informacion" role="note">
        <span className="icono-informacion">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
          </svg>
        </span>
        <p className="texto-informacion">Todos los pedidos se reclaman presencialmente en el club.</p>
      </div>

      <div className="tabla-contenido" role="tablist">
        <button
          type="button"
          className={`tab-btn ${pestana === "catalogo" ? "activo" : ""}`}
          onClick={() => setPestana("catalogo")}
        >
          Catálogo de Implementos
        </button>
        <button
          type="button"
          className={`tab-btn ${pestana === "solicitudes" ? "activo" : ""}`}
          onClick={() => setPestana("solicitudes")}
        >
          Mis Solicitudes
        </button>
      </div>

      {pestana === "catalogo" ? (
        <CatalogoImplementos onAviso={mostrarAviso} />
      ) : (
        <MisSolicitudes onAviso={mostrarAviso} />
      )}

      <AvisoToast aviso={aviso} />
    </div>
  );
}