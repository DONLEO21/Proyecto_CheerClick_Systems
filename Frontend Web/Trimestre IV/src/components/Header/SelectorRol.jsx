import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
export default function SelectorRol({ rol }) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => setAbierto(false), [pathname]);
  useEffect(() => {
    if (!abierto) return;
    const alClicFuera = (e) => {
      if (!contenedorRef.current?.contains(e.target)) setAbierto(false);
    };
    const alEscape = (e) => e.key === "Escape" && setAbierto(false);

    document.addEventListener("click", alClicFuera);
    document.addEventListener("keydown", alEscape);
    return () => {
      document.removeEventListener("click", alClicFuera);
      document.removeEventListener("keydown", alEscape);
    };
  }, [abierto]);

  let etiqueta = rol;
  let opciones = [];
  const ruta = pathname.toLowerCase().replace(/\/+$/, "");
  const esRutaAdmin = ruta.startsWith("/admin");

  if (esRutaAdmin && ruta.includes("horarios")) {
    etiqueta = "Administrador";
    opciones = [{ texto: "Vista Entrenador", ruta: "/admin/calendario" }];
  } else if (esRutaAdmin && ruta.includes("calendario")) {
    etiqueta = "Entrenador";
    opciones = [{ texto: "Vista Administrador", ruta: "/admin/horarios" }];
  }
  if (!opciones.length) {
    return <span className="etiqueta-rol">{etiqueta}</span>;
  }

  return (
    <div className={`selector-rol ${abierto ? "abierto" : ""}`} ref={contenedorRef}>
      <button
        type="button"
        className="etiqueta-rol"
        onClick={() => setAbierto((a) => !a)}
        aria-haspopup="true"
        aria-expanded={abierto}
      >
        {etiqueta}
        <i className="bi bi-chevron-down chevron-rol" aria-hidden="true" />
      </button>

      <div className="menu-rol" role="menu">
        {opciones.map((op) => (
          <button
            key={op.ruta}
            type="button"
            className="menu-rol__opcion"
            role="menuitem"
            onClick={() => {
              setAbierto(false);
              navigate(op.ruta);
            }}
          >
            {op.texto}
          </button>
        ))}
      </div>
    </div>
  );
}
