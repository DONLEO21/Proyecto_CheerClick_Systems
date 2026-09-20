// src/components/Compartidos/Proximamente.jsx
// Se muestra dentro del layout (con su sidebar y header) cuando una sección aún no existe.
import React from "react";

export default function Proximamente() {
  return (
    <div className="container-fluid py-5 text-center text-secondary">
      <i className="bi bi-tools fs-1 d-block mb-3" aria-hidden="true" />
      <h1 className="h4 fw-bold text-dark">Sección en construcción</h1>
      <p className="mb-0">Esta sección estará disponible pronto.</p>
    </div>
  );
}
