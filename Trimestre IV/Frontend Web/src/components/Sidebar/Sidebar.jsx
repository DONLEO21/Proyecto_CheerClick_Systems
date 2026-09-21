import { useState } from 'react';
import './Sidebar.css';

 function Sidebar({ items, activeHref, onNavigate }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <aside className="barra-lateral" aria-label="Menú de navegación principal">
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
          {items.map((item) => (
            <li
              key={item.href}
              className={
                'menu-lateral__elemento' +
                (activeHref === item.href ? ' menu-lateral__elemento--activo' : '')
              }
            >
              <a
                href={item.href}
                className="menu-lateral__enlace"
                title={item.titulo}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.href);
                }}
              >
                <img className="menu-lateral__icono" src={item.icono} alt={item.alt} />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
export default Sidebar