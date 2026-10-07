import { CalendarClock, ChevronRight } from "lucide-react";
import { ACTIVIDADES_ORDENADAS, MAX_ITEMS, RUTA_HORARIOS } from "./dashboardAdminData.js";

export default function TarjetaCampeonatos({ onNavigate }) {
  const total = ACTIVIDADES_ORDENADAS.length;

  return (
    <article className="tarjeta-dashboard">
      <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
        <span className="icono-cabecera">
          <CalendarClock size={22} strokeWidth={2} />
        </span>
        <h2>Próximos campeonatos</h2>
      </header>

      <div className="tarjeta-dashboard__contenido">
        <ul className="lista-actividades">
          {ACTIVIDADES_ORDENADAS.slice(0, MAX_ITEMS).map(
            ({ id, icono: Icono, variante, titulo, fecha }) => (
              <li className="lista-actividades__item" key={id}>
                <a
                  href={RUTA_HORARIOS}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(RUTA_HORARIOS);
                  }}
                >
                  <div
                    className={
                      "lista-actividades__icono" +
                      (variante ? ` lista-actividades__icono--${variante}` : "")
                    }
                  >
                    <Icono size={24} strokeWidth={2} />
                  </div>
                  <div className="lista-actividades__texto">
                    <h3>{titulo}</h3>
                    <p>{fecha}</p>
                  </div>
                </a>
              </li>
            ),
          )}
        </ul>
      </div>

      {/* siempre visible; el contador aparece solo si hay más de MAX_ITEMS */}
      <button
        type="button"
        className="enlace-ver-todas"
        onClick={() => onNavigate(RUTA_HORARIOS)}
      >
        Ver todos los campeonatos
        {total > MAX_ITEMS ? ` (${total})` : ""}
        <ChevronRight size={16} strokeWidth={2.2} />
      </button>
    </article>
  );
}