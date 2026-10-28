// src/components/Header/SelectorRol.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Píldora roja del encabezado con el rol actual.
 *
 * El admin también es entrenador de TODOS los niveles, por eso puede
 * alternar entre "Vista Administrador" y "Vista Entrenador" — pero ese
 * cambio de vista SOLO tiene sentido dentro del módulo de Horarios, no en
 * Dashboard, Cuentas, Perfil, etc. Por eso la etiqueta y el desplegable
 * se calculan a partir de la ruta actual (pathname), no de un rol fijo:
 *
 *  - /admin/horarios    -> "Administrador ▾" con opción "Vista Entrenador"
 *  - /admin/calendario  -> "Entrenador ▾" con opción "Vista Administrador"
 *                          (sigue siendo el admin: por eso el sidebar de
 *                          esa ruta es el de Admin, con acceso a todos
 *                          los niveles vía el selector de nivel)
 *  - cualquier otra ruta de /admin/*  -> "Administrador" plano, sin flecha
 *  - rutas de /entrenador/* (entrenador real) -> "Entrenador" plano,
 *    sin flecha: un entrenador real NO puede saltar a Admin
 *  - rutas de /atleta/*  -> "Atleta" plano, sin flecha
 *
 * props:
 *  - rol: rol por defecto para rutas sin caso especial ("Administrador" |
 *    "Entrenador" | "Atleta"), tal como ya se lo pasa PanelLayout.
 */
export default function SelectorRol({ rol }) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Cierra el menú al cambiar de ruta (por si quedó abierto)
  useEffect(() => setAbierto(false), [pathname]);

  // Cierra al hacer clic fuera o presionar Escape
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

  // ── Etiqueta y opciones según la ruta actual ──────────────
  let etiqueta = rol;
  let opciones = [];

  if (pathname === "/admin/horarios") {
    etiqueta = "Administrador";
    opciones = [{ texto: "Vista Entrenador", ruta: "/admin/calendario" }];
  } else if (pathname === "/admin/calendario") {
    etiqueta = "Entrenador";
    opciones = [{ texto: "Vista Administrador", ruta: "/admin/horarios" }];
  }
  // Cualquier otra ruta (Dashboard, Cuentas, Perfil, /entrenador/*, /atleta/*)
  // se queda con "etiqueta = rol" y "opciones = []" -> pastilla plana, sin flecha.

  // Sin opciones: pastilla plana, igual que antes (sin desplegable)
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
