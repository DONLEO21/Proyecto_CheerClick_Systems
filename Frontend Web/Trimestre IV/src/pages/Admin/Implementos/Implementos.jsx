import { useEffect, useState } from "react";
import ListaImplementos from "./ListaImplementos";
import SolicitudesProductos from "./SolicitudesProductos";
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

  const [pestana, setPestana] = useState("deportivos"); 

  return (
    <div className="container-fluid py-4">
      <h1 className="h3 mb-1">Implementos Deportivos</h1>
      <p className="text-muted mb-3">Controle los implementos deportivos y sus solicitudes aquí.</p>

      <div className="tabs-implementos">
        <button
          type="button"
          className={`tab-btn ${pestana === "deportivos" ? "activo" : ""}`}
          onClick={() => setPestana("deportivos")}
        >
          Implementos Deportivos
        </button>
        <button
          type="button"
          className={`tab-btn ${pestana === "solicitados" ? "activo" : ""}`}
          onClick={() => setPestana("solicitados")}
        >
          Productos Solicitados
        </button>
      </div>

      {pestana === "deportivos" ? (
        <ListaImplementos onAviso={mostrarAviso} />
      ) : (
        <SolicitudesProductos onAviso={mostrarAviso} />
      )}

      <AvisoToast aviso={aviso} />
    </div>
  );
}