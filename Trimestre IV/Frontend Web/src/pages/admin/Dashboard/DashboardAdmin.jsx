import { useNavigate } from 'react-router-dom';
import Header from "../../../components/Header/Header.jsx";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import menuAdmin from "../../../data/menuAdmin.js";
import { supabase } from "../../../services/supabase";
import useUsuario from "../../../hooks/useUsuario";

import { SquarePen } from "lucide-react";

import { RUTA_CUENTAS } from "./dashboardAdminData.js";
import useDashboardAdmin from "./useDashboardAdmin.js";

import TarjetaUsuarios from "./TarjetaUsuarios.jsx";
import TarjetaPagos from "./TarjetaPagos.jsx";
import TarjetaCampeonatos from "./TarjetaCampeonatos.jsx";
import TablaSolicitudes from "./TablaSolicitudes.jsx";
import TarjetaNovedades from "./TarjetaNovedades.jsx";

import { cerrarSesion as cerrarSesionSistema } from '../../../services/sesion'

import "./DashboardAdmin.css";

// nombreAdmin queda solo como respaldo si la cuenta no tiene nombre guardado
function DashboardAdmin({
  nombreAdmin = "Ronald Linares",
  onNavigate = () => {},
}) {
  // nombre ingresado en el registro (user_metadata.nombre)
  const usuario = useUsuario();
  const nombreCompleto = usuario.nombre || (usuario.cargando ? "" : nombreAdmin);
  const primerNombre = nombreCompleto.split(" ")[0];

  const { stats, pendientes, cargando, error } = useDashboardAdmin();

  const navigate = useNavigate()
  const cerrarSesion = () => cerrarSesionSistema(navigate)

  const irAInicio = () => {
    window.location.href = "/admin";
  };

  // Navega a la pantalla de cuentas. Con un id, esa pantalla abre el modal de esa solicitud.
  const irACuentas = (id) => {
    window.location.href = id ? `${RUTA_CUENTAS}?ver=${id}` : RUTA_CUENTAS;
  };

  return (
    <div className="dashboard">
      <Sidebar
        items={menuAdmin}
        activeHref="/admin"
        onNavigate={(href) => (window.location.href = href)}
      />

      <div className="dashboard__contenido">
        <Header rol="Administrador" onCerrarSesion={cerrarSesion} onIrInicio={irAInicio} />

        <main className="admin-main">
          <div className="contenedor">
            <section className="bienvenida-admin" aria-labelledby="titulo-dashboard">
              <div className="bienvenida-admin__texto">
                <h1 id="titulo-dashboard">Hola, {primerNombre} 👋</h1>
              </div>

              <a
                href="/admin/perfil"
                className="btn btn-primario bienvenida-admin__perfil"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/admin/perfil";
                }}
              >
                <SquarePen size={24} strokeWidth={2} />
                Perfil
              </a>
            </section>

            <section className="panel-resumen-admin" aria-label="resumen del administrador">
              <TarjetaUsuarios
                stats={stats}
                cargando={cargando}
                error={error}
                onGestionar={() => irACuentas()}
              />

              <TarjetaPagos onNavigate={onNavigate} />

              <TarjetaCampeonatos onNavigate={onNavigate} />

              <TablaSolicitudes
                pendientes={pendientes}
                cargando={cargando}
                error={error}
                onVer={irACuentas}
                onVerTodas={() => irACuentas()}
              />

              <TarjetaNovedades onNavigate={onNavigate} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardAdmin;