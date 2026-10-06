import { useNavigate } from 'react-router-dom';
import Header from "../../../components/Header/Header.jsx";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import AvisoToast from "../../../components/AvisoToast";
import menuAtleta from "../../../data/menuAtleta.js";
import { supabase } from "../../../services/supabase";
import useUsuario from "../../../hooks/useUsuario";
import useAviso from "../../../hooks/useAviso";

import { SquarePen } from 'lucide-react';

import { RUTAS, RUTA_INICIO_ATLETA } from './dashboardAtletaData.js';
import useDashboardAtleta from './useDashboardAtleta.js';

import TarjetaRendimiento, { TarjetaProgreso } from './TarjetaRendimiento.jsx';
import TarjetaCalendario from './TarjetaCalendario.jsx';
import TarjetaPerfilAtleta from './TarjetaPerfilAtleta.jsx';
import TarjetaMensualidades from './TarjetaMensualidades.jsx';
import TarjetaPqrsAtleta from './TarjetaPqrsAtleta.jsx';
import SeccionTorneos from './SeccionTorneos.jsx';

import { cerrarSesion as cerrarSesionSistema } from '../../../services/sesion'

import './DashboardAtleta.css';

export default function DashboardAtleta({
  nombreAtleta = 'Atleta',
  onNavigate = (href) => { window.location.href = href; },
}) {
  const usuario = useUsuario();
  const nombreCompleto = usuario.nombre || (usuario.cargando ? '' : nombreAtleta);
  const primerNombre = nombreCompleto.split(' ')[0];
  const { aviso, mostrarAviso } = useAviso();

  const { base, hoy, metricas, pqrsResumen, pagos, proximo, calendario } = useDashboardAtleta(mostrarAviso);

  const navigate = useNavigate()
  const cerrarSesion = () => cerrarSesionSistema(navigate)
  const irAInicio = () => { window.location.href = '/'; };

  return (
    <div className="dashboard">
      <Sidebar items={menuAtleta} activeHref={RUTA_INICIO_ATLETA}
        onNavigate={(href) => (window.location.href = href)} />

      <div className="dashboard__contenido">
        <Header rol="Atleta" onCerrarSesion={cerrarSesion} onIrInicio={irAInicio} />

        <main className="panel-atleta">
          <div className="contenedor">

            <section className="bienvenida-atleta" aria-labelledby="titulo-dashboard">
              <h1 id="titulo-dashboard">Hola, {primerNombre} 👋</h1>
              <button type="button" className="btn btn-primario" onClick={() => onNavigate(RUTAS.perfil)}>
                <SquarePen size={24} strokeWidth={2} /> Perfil
              </button>
            </section>

            <section className="panel-resumen-atleta" aria-label="resumen del atleta">
              <TarjetaRendimiento
                habilidades={base.habilidades}
                variacion={metricas.variacion}
                onVer={() => onNavigate(RUTAS.rendimiento)} />

              <TarjetaProgreso categorias={metricas.porCat} />

              <TarjetaCalendario
                mes={calendario.mes}
                onCambiarMes={calendario.cambiarMes}
                porDia={calendario.porDia}
                asistencias={base.asist}
                cargando={calendario.cargando}
                diaSel={calendario.diaSel}
                onSeleccionarDia={calendario.setDiaSel}
                hoy={hoy}
                onVerEntrenamientos={() => onNavigate(RUTAS.entrenamientos)} />

              <TarjetaPerfilAtleta
                nombre={nombreCompleto}
                foto={usuario.foto || null}
                nivel={base.nivel?.nombre ?? 'Sin nivel'}
                entrenamientos={metricas.entrenamientos}
                torneosInscritos={base.inscritos.length}
                proximo={proximo} />

              <TarjetaMensualidades pagos={pagos} onVer={() => onNavigate(RUTAS.mensualidades)} />

              <TarjetaPqrsAtleta resumen={pqrsResumen} onVer={() => onNavigate(RUTAS.pqrs)} />
            </section>

            <SeccionTorneos
              torneos={base.torneos}
              inscritos={base.inscritos}
              onSeleccionar={(id) => onNavigate(RUTAS.torneo(id))} />
          </div>
        </main>
      </div>
      <AvisoToast aviso={aviso} />
    </div>
  );
}