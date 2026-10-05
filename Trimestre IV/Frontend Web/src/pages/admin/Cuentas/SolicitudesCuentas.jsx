import { useEffect, useState } from 'react'
import { Search, Users } from 'lucide-react'
import Header from '../../../components/Header/Header.jsx'
import Sidebar from '../../../components/Sidebar/Sidebar.jsx'
import AvisoToast from '../../../components/AvisoToast'
import menuAdmin from '../../../data/menuAdmin.js'
import { supabase } from '../../../services/supabase'
import useAviso from '../../../hooks/useAviso'

import useCuentas from './useCuentas.js'
import VistaSolicitudes from './VistaSolicitudes.jsx'
import VistaGestion from './VistaGestion.jsx'
import ModalDetalle from './ModalDetalle.jsx'
import ModalConfirmar from './ModalConfirmar.jsx'

import './SolicitudCuentas.css'

export default function SolicitudesCuentas() {
  const { aviso, mostrarAviso } = useAviso()
  const c = useCuentas(mostrarAviso)

  const [busqueda, setBusqueda] = useState('')
  useEffect(() => { setBusqueda('') }, [c.esGestion])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/acceso'
  }
  const irAInicio = () => { window.location.href = '/admin' }

  // Desde el modal de detalle: cierra el detalle y pide confirmación
  const accionDesdeDetalle = (usuario, accion) => {
    c.pedirConfirmacion(usuario, accion)
    c.cerrarDetalle()
  }

  return (
    <div className="dashboard">
      <Sidebar items={menuAdmin} activeHref="/admin/usuarios"
        onNavigate={(href) => (window.location.href = href)} />

      <div className="dashboard__contenido">
        <Header rol="Administrador" onCerrarSesion={cerrarSesion} onIrInicio={irAInicio} />

        <main className="admin-main">
          <div className="contenedor">
            <section className="pagina-encabezado">
              <h1>{c.esGestion ? 'Gestión de cuentas' : 'Solicitudes de nuevas cuentas'}</h1>
              <p className="pagina-subtitulo">
                {c.esGestion
                  ? 'Activa o desactiva el acceso y define el rol de los miembros registrados en el club.'
                  : 'Gestiona las solicitudes de ingreso de nuevos miembros del club.'}
              </p>
            </section>

            <div className="acciones-barra">
              <div className="buscar-wrap">
                <Search size={15} strokeWidth={2} />
                <input
                  type="text"
                  placeholder={c.esGestion ? 'Buscar usuario' : 'Buscar solicitud'}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className="acciones-btns">
                <button className={`btn ${c.esGestion ? 'btn-azul' : 'btn-amarillo'}`} onClick={c.alternarVista}>
                  <Users size={15} strokeWidth={2} /> {c.esGestion ? 'Validar cuentas' : 'Gestionar cuentas'}
                </button>
              </div>
            </div>

            {c.esGestion ? (
              <VistaGestion
                usuarios={c.usuarios}
                cargando={c.cargando}
                busqueda={busqueda}
                onToggle={(u) => c.pedirConfirmacion(u, u.activo ? 'desactivar' : 'activar')}
                onCambiarRol={(u, rol) => c.pedirConfirmacion(u, 'cambiar-rol', { rol })}
              />
            ) : (
              <VistaSolicitudes
                usuarios={c.usuarios}
                cargando={c.cargando}
                tab={c.tab}
                onTab={c.setTab}
                busqueda={busqueda}
                onVer={c.abrirDetalle}
                onAccion={c.pedirConfirmacion}
              />
            )}
          </div>

          {c.detalle && (
            <ModalDetalle
              detalle={c.detalle}
              perfil={c.perfilDetalle}
              cargandoPerfil={c.cargandoDetalle}
              onCerrar={c.cerrarDetalle}
              onAccion={accionDesdeDetalle}
            />
          )}

          {c.confirmar && (
            <ModalConfirmar
              confirmar={c.confirmar}
              onCancelar={c.cancelarConfirmacion}
              onConfirmar={c.ejecutar}
            />
          )}

          <AvisoToast aviso={aviso} />
        </main>
      </div>
    </div>
  )
}