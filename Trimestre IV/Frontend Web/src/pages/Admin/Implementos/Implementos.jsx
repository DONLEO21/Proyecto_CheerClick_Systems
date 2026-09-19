import { useState } from "react";
import ListaImplementos from "./ListaImplementos";
import SolicitudesProductos from "./SolicitudesProductos";
import "./Implementos.css";

export default function Implementos() {
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

      {pestana === "deportivos" ? <ListaImplementos /> : <SolicitudesProductos />}
    </div>
  );
}