import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import AvisoToast from '../../components/AvisoToast';
import useAviso from '../../hooks/useAviso';
import useUsuario from '../../hooks/useUsuario';
import { supabase } from '../../services/supabase';

import usePerfil from './usePerfil.js';
import { MENUS, ETIQUETA_HEADER, iniciales } from './perfilData.js';
import TarjetaEncabezado from './TarjetaEncabezado.jsx';
import TarjetaSeguridad from './TarjetaSeguridad.jsx';
import TarjetaPreferencias from './TarjetaPreferencias.jsx';
import TarjetaInfoPersonal from './TarjetaInfoPersonal.jsx';
import TarjetaContactos from './TarjetaContactos.jsx';
import ModalFoto from './ModalFoto.jsx';
import ModalConfirmar from './ModalConfirmar.jsx';
import './PerfilUsuario.css';

export default function PerfilUsuario({ rol = 'atleta' }) {
  const esAtleta = rol === 'atleta';

  const navigate = useNavigate();
  const { aviso, mostrarAviso } = useAviso();

  const usuario = useUsuario();
  const nombreCompleto = usuario.nombre || (usuario.cargando ? '' : 'Usuario');
  const apellido = usuario.apellido || '';
  const inicialesUsuario = iniciales(nombreCompleto);

  const {
    datos, vista, bloqueos, editando, guardando, guardandoFoto,
    errorGuardar, cargandoPerfil, modal, setModal,
    cantidadContactos, cambiosUnaVez,
    cambiar, cambiarContacto, cambiarArchivoEps,
    activarEdicion, cancelarEdicion, confirmarGuardar, guardarFoto,
  } = usePerfil({ rol, mostrarAviso });

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate('/acceso');
  };

  return (
    <div className="dashboard perfil-pagina">
      <Sidebar
        items={MENUS[rol] ?? []}
        activeHref={`/${rol}/perfil`}
        onNavigate={(href) => navigate(href)}
      />

      <div className="dashboard__contenido">
        <Header
          rol={ETIQUETA_HEADER[rol]}
          onCerrarSesion={cerrarSesion}
          onIrInicio={() => navigate(`/${rol}`)}
        />

        <main className="panel-atleta perfil-main">
          <div className="contenedor perfil-contenedor">

            <section className="pagina-encabezado">
              <h1>Mi perfil</h1>
              <p className="pagina-encabezado__sub">
                Gestiona tu información personal y preferencias de cuenta.
              </p>
            </section>

            {cargandoPerfil ? (
              <p className="perfil-cargando">Cargando tu información…</p>
            ) : (
              <div className="perfil-layout">

                {/* Foto y nombre */}
                <TarjetaEncabezado
                  rol={rol}
                  esAtleta={esAtleta}
                  fotoUrl={datos.fotoUrl}
                  inicialesUsuario={inicialesUsuario}
                  nombreCompleto={nombreCompleto}
                  apellido={apellido}
                  editando={editando}
                  onCambiarFoto={() => setModal('foto')}
                  onEditar={activarEdicion}
                  onGuardar={() => setModal('confirmar')}
                  onCancelar={cancelarEdicion}
                />

                {/* Seguridad + Preferencias, lado a lado */}
                <div className="perfil-fila-doble">
                  <TarjetaSeguridad
                    onCambiarContrasena={() => navigate('/acceso?view=pantalla-recuperar-3')}
                  />
                  <TarjetaPreferencias />
                </div>

                {/* Información personal */}
                <TarjetaInfoPersonal
                  vista={vista}
                  editando={editando}
                  bloqueos={bloqueos}
                  onCambiar={cambiar}
                  onCambiarArchivoEps={cambiarArchivoEps}
                />

                {/* Contactos de emergencia: 2 para atleta, 1 para entrenador/admin */}
                <TarjetaContactos
                  contactos={vista.contactos}
                  editando={editando}
                  onCambio={cambiarContacto}
                  cantidad={cantidadContactos}
                />
              </div>
            )}
          </div>

          {/* ===== Modales ===== */}

          <ModalFoto
            abierto={modal === 'foto'}
            fotoActual={datos.fotoUrl}
            iniciales={inicialesUsuario}
            guardando={guardandoFoto}
            onCerrar={() => setModal(null)}
            onGuardar={guardarFoto}
          />

          <ModalConfirmar
            abierto={modal === 'confirmar'}
            onCerrar={() => setModal(null)}
            cambiosUnaVez={cambiosUnaVez}
            errorGuardar={errorGuardar}
            guardando={guardando}
            onConfirmar={confirmarGuardar}
          />
        </main>
      </div>

      <AvisoToast aviso={aviso} />
    </div>
  );
}