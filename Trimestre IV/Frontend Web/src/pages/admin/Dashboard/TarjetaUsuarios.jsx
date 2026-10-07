import { Users, UserCheck, UserX } from "lucide-react";
import { RUTA_CUENTAS } from "./dashboardAdminData.js";

export default function TarjetaUsuarios({ stats, cargando, error, onGestionar }) {
  const valor = (n) => (cargando || error ? "—" : n);

  const items = [
    { clave: "total", Icono: Users, numero: stats.total, etiqueta: "Usuarios totales" },
    { clave: "activos", Icono: UserCheck, numero: stats.activos, etiqueta: "Usuarios activos" },
    { clave: "inactivos", Icono: UserX, numero: stats.inactivos, etiqueta: "Usuarios inactivos" },
  ];

  return (
    <article className="tarjeta-dashboard tarjeta-dashboard--atletas">
      <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
        <span className="icono-cabecera">
          <Users size={22} strokeWidth={2} />
        </span>
        <h2>Usuarios</h2>
      </header>

      <div className="tarjeta-dashboard__contenido lista-usuarios-stats">
        {items.map(({ clave, Icono, numero, etiqueta }) => (
          <div className={`stat-usuarios stat-usuarios--${clave}`} key={clave}>
            <span className="stat-usuarios__icono">
              <Icono size={20} strokeWidth={2} />
            </span>
            <div className="stat-usuarios__texto">
              <span className="stat-usuarios__numero">{valor(numero)}</span>
              <span className="stat-usuarios__etiqueta">{etiqueta}</span>
            </div>
          </div>
        ))}
      </div>

      <a
        href={RUTA_CUENTAS}
        className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--ancho"
        onClick={(e) => {
          e.preventDefault();
          onGestionar();
        }}
      >
        Gestionar cuentas
      </a>
    </article>
  );
}