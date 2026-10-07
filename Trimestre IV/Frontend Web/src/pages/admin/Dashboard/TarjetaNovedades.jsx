import { Megaphone } from "lucide-react";
import { NOVEDADES_ORDENADAS, MAX_ITEMS, RUTA_NOVEDADES } from "./dashboardAdminData.js";

export default function TarjetaNovedades({ onNavigate }) {
  return (
    <article className="tarjeta-dashboard">
      <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
        <span className="icono-cabecera">
          <Megaphone size={22} strokeWidth={2} />
        </span>
        <h2>Novedades</h2>
      </header>

      <div className="tarjeta-dashboard__contenido">
        <ul className="lista-novedades">
          {NOVEDADES_ORDENADAS.slice(0, MAX_ITEMS).map(
            ({ id, icono: Icono, titulo, detalle }) => (
              <li className="lista-novedades__item" key={id}>
                <a
                  href={RUTA_NOVEDADES}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(RUTA_NOVEDADES);
                  }}
                >
                  <div className="lista-novedades__icono">
                    <Icono size={24} strokeWidth={2} />
                  </div>
                  <div className="lista-novedades__texto">
                    <h3>{titulo}</h3>
                    <p>{detalle}</p>
                  </div>
                </a>
              </li>
            ),
          )}
        </ul>
      </div>
    </article>
  );
}