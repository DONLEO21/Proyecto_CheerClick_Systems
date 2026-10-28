import { useNavigate } from 'react-router-dom';
import { SquarePen } from 'lucide-react'
import Header from '../../../components/Header/Header.jsx'
import Sidebar from '../../../components/Sidebar/Sidebar.jsx'
import AvisoToast from '../../../components/AvisoToast'
import menuEntrenador from '../../../data/menuEntrenador.js'
import { supabase } from '../../../services/supabase'
import useUsuario from '../../../hooks/useUsuario'
import useAviso from '../../../hooks/useAviso'

import { RUTA_PERFIL, RUTA_ENTRENAMIENTOS, RUTA_INICIO_ENTRENADOR } from './dashboardEntrenadorData.js'
import useDashboardEntrenador from './useDashboardEntrenador.js'

import TarjetaResumen from './TarjetaResumen.jsx'
import TarjetaProgreso from './TarjetaProgreso.jsx'
import TarjetaAtletas from './TarjetaAtletas.jsx'
import TarjetaCalendario from './TarjetaCalendario.jsx'
import TarjetaRendimientoEquipo from './TarjetaRendimientoEquipo.jsx'

import { cerrarSesion as cerrarSesionSistema } from '../../../services/sesion'

import './DashboardEntrenador.css'

export default function DashboardEntrenador({
  nombreEntrenador = 'Entrenador',
  onNavigate = (href) => { window.location.href = href },
}) {
  const usuario = useUsuario()
  const nombreCompleto = usuario.nombre || (usuario.cargando ? '' : nombreEntrenador)
  const primerNombre = nombreCompleto.split(' ')[0]
  const { aviso, mostrarAviso } = useAviso()

  const {
    base, cargando, hoy, nombreNivel, tieneNivel,
    metricas, atletasActivos, entrenosHoy, calendario,
  } = useDashboardEntrenador(mostrarAviso)

  const navigate = useNavigate()
  const cerrarSesion = () => cerrarSesionSistema(navigate)
  const irAInicio = () => { window.location.href = '/' }

  return (
    <>
      <Sidebar
        items={menuEntrenador}
        activeHref={RUTA_INICIO_ENTRENADOR}
        onNavigate={(href) => (window.location.href = href)}
      />
      <Header rol="Entrenador" onCerrarSesion={cerrarSesion} onIrInicio={irAInicio} />

      <main className="de-pagina">
        <div className="de-grid">
          <section className="de-tarjeta de-tarjeta--plana de-col-20 de-bienvenida" aria-labelledby="de-titulo">
            <h1 id="de-titulo">Hola, {primerNombre} 👋</h1>
            <button type="button" className="de-btn-rojo" onClick={() => onNavigate(RUTA_PERFIL)}>
              <SquarePen size={22} strokeWidth={2} /> Perfil
            </button>
          </section>

          <TarjetaResumen
            cargando={cargando}
            atletasActivos={atletasActivos}
            entrenosHoy={entrenosHoy}
            metricas={metricas}
          />

          <TarjetaProgreso metricas={metricas} cargando={cargando} />

          <TarjetaAtletas
            atletas={base.atletas}
            niveles={base.niveles}
            nombreNivel={nombreNivel}
            tieneNivel={tieneNivel}
            cargando={cargando}
          />

          <TarjetaCalendario
            mes={calendario.mes}
            onCambiarMes={calendario.cambiarMes}
            porDia={calendario.porDia}
            cargando={calendario.cargando}
            diaSel={calendario.diaSel}
            onSeleccionarDia={calendario.setDiaSel}
            hoy={hoy}
            nombreNivel={nombreNivel}
            onVer={() => onNavigate(RUTA_ENTRENAMIENTOS)}
          />

          <TarjetaRendimientoEquipo
            equipo={metricas.equipo}
            cargando={cargando}
            esDemo={metricas.esDemo}
          />
        </div>
      </main>

      <AvisoToast aviso={aviso} />
    </>
  )
}