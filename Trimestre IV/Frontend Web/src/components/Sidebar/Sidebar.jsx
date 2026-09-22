
import { useEffect, useRef, useState } from 'react';
import './Sidebar.css';
// El admin también es entrenador de TODOS los niveles: cuando entra en
// "Vista Entrenador" navega a /admin/calendario, pero esa pantalla sigue
// siendo, para efectos del menú, la sección "Horarios". Por eso su ruta
// se trata como un alias de /admin/horarios al decidir qué ícono resaltar.
const ALIAS_RUTAS = {
  '/admin/calendario': '/admin/horarios',
};

function normalizarRuta(ruta) {
  return (ruta || '').toLowerCase().replace(/\/+$/, '');
}

function esRutaActiva(activeHref, href) {
  if (!activeHref) return false;
  const normalizada = normalizarRuta(activeHref);
  const actual = ALIAS_RUTAS[normalizada] || normalizada;
  const destino = normalizarRuta(href);
  return actual === destino || actual.startsWith(destino + '/');
}

function Sidebar({ items, activeHref, onNavigate }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const barraRef = useRef(null);

  useEffect(() => {
    if (!menuAbierto) return;

    const alPresionar = (e) => {
      if (e.key === 'Escape') setMenuAbierto(false);
    };
    const alHacerClic = (e) => {
      if (barraRef.current && !barraRef.current.contains(e.target)) setMenuAbierto(false);
    };

    document.addEventListener('keydown', alPresionar);
    document.addEventListener('mousedown', alHacerClic);
    return () => {
      document.removeEventListener('keydown', alPresionar);
      document.removeEventListener('mousedown', alHacerClic);
    };
  }, [menuAbierto]);

  return (
    <aside
      ref={barraRef}
      className={'barra-lateral' + (menuAbierto ? ' barra-lateral--abierta' : '')}
      aria-label="Menú de navegación principal"
    >
      <button
        className="boton-menu"
        type="button"
        aria-label="Abrir o cerrar menú"
        aria-expanded={menuAbierto}
        onClick={() => setMenuAbierto((abierto) => !abierto)}
      >
        <span className="boton-menu__linea"></span>
        <span className="boton-menu__linea"></span>
        <span className="boton-menu__linea"></span>
      </button>

      <nav className="w-100">
        <ul className="menu-lateral list-unstyled mb-0" role="list">
          {items.map((item) => {
            const activo = esRutaActiva(activeHref, item.href);

            return (
              <li
                key={item.href}
                className={'menu-lateral__elemento' + (activo ? ' menu-lateral__elemento--activo' : '')}
              >
                <a
                  href={item.href}
                  className="menu-lateral__enlace"
                  title={menuAbierto ? undefined : item.titulo}
                  aria-current={activo ? 'page' : undefined}
                  onClick={(e) => {
                    setMenuAbierto(false);
                    if (!onNavigate) return;
                    e.preventDefault();
                    onNavigate(item.href);
                  }}
                >
                  <img
                    className="menu-lateral__icono"
                    src={item.icono}
                    alt={menuAbierto ? '' : item.alt}
                  />
                  <span className="menu-lateral__texto" aria-hidden={!menuAbierto}>
                    {item.titulo}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
export default Sidebar
