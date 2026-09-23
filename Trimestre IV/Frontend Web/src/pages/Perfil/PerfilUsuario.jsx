import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AvisoToast from '../../components/AvisoToast';
import useAviso from '../../hooks/useAviso';
import useUsuario from '../../hooks/useUsuario';
import { supabase } from '../../services/supabase';
import { cargarPerfilPropio, guardarPerfilPropio } from '../../services/perfil';
import {
  User, CreditCard, Mail, Phone, Heart, File, FileText, MessageSquare,
  Users, Shield, Lock, Bell, Pencil, Save, X, CloudUpload,
  Calendar, VenusAndMars, BadgeCheck, Wallet,
} from 'lucide-react';
import './PerfilUsuario.css';

/* ────────────────────────────────────────────────────────────
   Configuración
──────────────────────────────────────────────────────────── */

const ETIQUETA_ROL = {
  atleta: 'Cuenta atleta',
  entrenador: 'Cuenta entrenador',
  admin: 'Cuenta administrador',
};

const CAMPOS_UNA_VEZ = ['genero', 'fechaNacimiento', 'numeroDocumento'];

const ETIQUETA_CAMPO = {
  genero: 'Género',
  fechaNacimiento: 'Fecha de nacimiento',
  numeroDocumento: 'Número de documento',
};

const TIPOS_DOCUMENTO = [
  { value: 'cedula', label: 'Cédula de ciudadanía' },
  { value: 'tarjeta', label: 'Tarjeta de identidad' },
  { value: 'pasaporte', label: 'Pasaporte' },
  { value: 'extranjeria', label: 'Cédula de extranjería' },
];

const GENEROS = [
  { value: 'femenino', label: 'Femenino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'otro', label: 'Otro' },
  { value: 'no-decir', label: 'Prefiero no decirlo' },
];

const EPS = [
  { value: 'compensar', label: 'Compensar' },
  { value: 'coomeva', label: 'Coomeva' },
  { value: 'famisanar', label: 'Famisanar' },
  { value: 'nuevaeps', label: 'Nueva EPS' },
  { value: 'salud-total', label: 'Salud Total' },
  { value: 'sanitas', label: 'Sanitas' },
  { value: 'sura', label: 'SURA' },
  { value: 'otra', label: 'Otra' },
];

const PARENTESCOS = [
  { value: 'madre-padre', label: 'Madre / Padre' },
  { value: 'tutor', label: 'Tutor' },
  { value: 'conyuge-pareja', label: 'Cónyuge / Pareja' },
  { value: 'otro', label: 'Otro' },
];

// Bucket público de Supabase Storage donde se guardan las fotos de perfil
const BUCKET_AVATARES = 'avatars';
const MAX_FOTO = 5 * 1024 * 1024; // 5MB
const TIPOS_FOTO = ['image/jpeg', 'image/png'];

// Valores por defecto mientras carga el perfil real desde Supabase
const DATOS_INICIALES = {
  fotoUrl: null,
  tipoDocumento: 'cedula',
  numeroDocumento: '',
  genero: '',
  fechaNacimiento: '',
  correo: '',
  telefono: '',
  eps: '',
  certificadoEpsNombre: '',
  certificadoEpsPath: '',
  certificadoEpsUrl: '',
  certificadoEpsArchivo: null,
  // Estos dos los define el administrador; el usuario solo los puede VER, nunca editar
  // (el trigger de la base de datos rechaza cualquier intento de cambiarlos desde aquí).
  nivel: '',
  planMensualidad: '',
  contactos: [
    { nombre: '', apellido: '', telefono: '', parentesco: 'madre-padre' },
    { nombre: '', apellido: '', telefono: '', parentesco: 'madre-padre' },
  ],
};

const BLOQUEOS_INICIALES = {
  genero: false,
  fechaNacimiento: false,
  numeroDocumento: false,
};

// Convierte la fila de la tabla `perfiles` (snake_case) al shape del formulario (camelCase)
function perfilDesdeFila(fila, correoAuth) {
  return {
    fotoUrl: fila.foto_url ?? null,
    tipoDocumento: fila.tipo_documento ?? 'cedula',
    numeroDocumento: fila.numero_documento ?? '',
    genero: fila.genero ?? '',
    fechaNacimiento: fila.fecha_nacimiento ?? '',
    correo: correoAuth ?? '',
    telefono: fila.telefono ?? '',
    eps: fila.eps ?? '',
    certificadoEpsNombre: fila.certificado_eps_nombre ?? '',
    certificadoEpsPath: fila.certificado_eps_url ?? '', // en DB se guarda la ruta del archivo, no una URL pública
    certificadoEpsUrl: '', // se completa con un enlace firmado al cargar (ver useEffect)
    certificadoEpsArchivo: null,
    nivel: fila.nivel ?? '',
    planMensualidad: fila.plan_mensualidad ?? '',
    contactos: fila.contactos?.length ? fila.contactos : DATOS_INICIALES.contactos,
  };
}

function iniciales(nombreCompleto) {
  return (nombreCompleto || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

/* ────────────────────────────────────────────────────────────
   Componentes pequeños reutilizables
──────────────────────────────────────────────────────────── */

function Campo({ id, label, icono: Icono, children, aviso }) {
  return (
    <div className="form-grupo">
      <div className="form-grupo__cabecera">
        <label htmlFor={id}>{label}</label>
        {aviso && <small className="campo-aviso">{aviso}</small>}
      </div>
      <div className="campo-icono-perfil">
        <Icono size={16} />
        {children}
      </div>
    </div>
  );
}

function Modal({ abierto, onCerrar, children, className = '', labelledBy }) {
  if (!abierto) return null;
  return (
    <div
      className="perfil-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      <div className={`perfil-modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {children}
      </div>
    </div>
  );
}

function TituloSeccion({ icono: Icono, titulo, sub }) {
  return (
    <div className="seccion-titulo">
      <span className="seccion-titulo__icono"><Icono size={17} /></span>
      <div>
        <h3>{titulo}</h3>
        {sub && <p className="seccion-titulo__sub">{sub}</p>}
      </div>
    </div>
  );
}

function BloqueContacto({ numero, contacto, editando, onCambio }) {
  const p = `emergencia${numero}`;

  return (
    <div className="contacto-bloque">
      <div className="contacto-bloque__cabecera">
        <h4>Contacto {numero}</h4>
        <span className="contacto-bloque__etiqueta">
          {numero === 1 ? 'Principal' : 'Secundario'}
        </span>
      </div>

      <div className="campos-grid">
        <Campo id={`${p}-nombre`} label="Nombre" icono={User}>
          <input
            type="text" id={`${p}-nombre`} value={contacto.nombre} disabled={!editando}
            onChange={(e) => onCambio('nombre', e.target.value)}
          />
        </Campo>
        <Campo id={`${p}-apellido`} label="Apellido" icono={User}>
          <input
            type="text" id={`${p}-apellido`} value={contacto.apellido} disabled={!editando}
            onChange={(e) => onCambio('apellido', e.target.value)}
          />
        </Campo>
        <Campo id={`${p}-telefono`} label="Teléfono" icono={Phone}>
          <input
            type="tel" id={`${p}-telefono`} value={contacto.telefono} disabled={!editando}
            onChange={(e) => onCambio('telefono', e.target.value)}
          />
        </Campo>
        <Campo id={`${p}-parentesco`} label="Parentesco" icono={Users}>
          <select
            id={`${p}-parentesco`} value={contacto.parentesco} disabled={!editando}
            onChange={(e) => onCambio('parentesco', e.target.value)}
          >
            {PARENTESCOS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Campo>
      </div>
    </div>
  );
}

// `cantidad`: cuántos contactos mostrar (2 para atleta, 1 para entrenador/admin)
function TarjetaContactos({ contactos, editando, onCambio, cantidad = 2 }) {
  return (
    <div className="tarjeta-p">
      <TituloSeccion
        icono={MessageSquare}
        titulo="Contactos de emergencia"
        sub={
          cantidad === 1
            ? '1 contacto a quien avisar en caso de emergencia'
            : 'Hasta 2 contactos a quienes avisar en caso de emergencia'
        }
      />
      <div className="divisor" />
      <div className="contactos-grid">
        {contactos.slice(0, cantidad).map((c, i) => (
          <BloqueContacto
            key={i}
            numero={i + 1}
            contacto={c}
            editando={editando}
            onCambio={(campo, valor) => onCambio(i, campo, valor)}
          />
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Modal de foto de perfil
──────────────────────────────────────────────────────────── */

function ModalFoto({ abierto, fotoActual, iniciales: iniIniciales, onCerrar, onGuardar, guardando }) {
  const inputRef = useRef(null);
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [arrastrando, setArrastrando] = useState(false);

  useEffect(() => {
    if (!abierto) {
      setArchivo(null);
      setPreview(null);
      setError('');
      setArrastrando(false);
    }
  }, [abierto]);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const procesar = (file) => {
    if (!file) return;
    if (!TIPOS_FOTO.includes(file.type)) {
      setError('Formato no permitido. Usa una imagen JPG o PNG.');
      return;
    }
    if (file.size > MAX_FOTO) {
      setError('La imagen supera los 5MB. Elige una más liviana.');
      return;
    }
    setError('');
    setArchivo(file);
    setPreview(URL.createObjectURL(file));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setArrastrando(false);
    procesar(e.dataTransfer.files[0]);
  };

  const mostrar = preview || fotoActual;

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} labelledBy="perfil-modal-foto-titulo">
      <div className="perfil-modal-cabeza">
        <h2 className="perfil-modal-cabeza__titulo" id="perfil-modal-foto-titulo">Cambiar foto de perfil</h2>
        <button className="perfil-modal-cerrar" type="button" onClick={onCerrar} aria-label="Cerrar">
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      <p className="perfil-modal-descripcion">
        Selecciona una nueva foto de perfil. La imagen debe ser JPG o PNG y no debe superar los 5MB.
      </p>

      <div className="perfil-modal-foto-preview-zona">
        <figure className="perfil-modal-foto-preview">
          {mostrar ? (
            <img src={mostrar} alt="Vista previa de la foto" />
          ) : (
            <span className="perfil-modal-foto-preview__vacia" aria-hidden="true">{iniIniciales}</span>
          )}
        </figure>
      </div>

      <div
        className={`zona-carga ${arrastrando ? 'zona-carga--activa' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={onDrop}
      >
        <CloudUpload size={34} strokeWidth={1.5} />
        <p className="zona-carga__texto">Arrastra y suelta la imagen aquí</p>
        <span className="zona-carga__o">o</span>
        <button className="btn btn-outline-rojo" type="button" onClick={() => inputRef.current?.click()}>
          Selecciona la imagen
        </button>
        <input
          ref={inputRef} type="file" accept="image/jpeg,image/png" hidden
          onChange={(e) => procesar(e.target.files[0])}
        />
        <p className="zona-carga__formatos">Formatos permitidos: JPG, PNG. Máximo 5MB.</p>
      </div>

      {error && <p className="estado-carga estado-carga--error" role="alert">{error}</p>}

      <div className="perfil-modal-pie">
        <button className="btn btn-blanco" type="button" onClick={onCerrar}>Cancelar</button>
        <button
          className="btn btn-primario" type="button" disabled={!archivo || guardando}
          onClick={() => onGuardar(archivo, preview)}
        >
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </Modal>
  );
}

/* ────────────────────────────────────────────────────────────
   Página

   IMPORTANTE: esta página se renderiza siempre dentro de <PanelLayout>
   (ver App.jsx: /admin/perfil, /atleta/perfil, /entrenador/perfil van
   anidadas dentro de una ruta que ya monta <PanelLayout>). PanelLayout
   ya pone <Sidebar>, <Header> y el <main className="contenido-principal">
   que envuelve el <Outlet />. Por eso este componente NO debe volver a
   renderizar Sidebar/Header: antes lo hacía y eso duplicaba ambos
   (dos sidebars fijos superpuestos, doble margin-left/margin-top, etc.)
──────────────────────────────────────────────────────────── */

export default function PerfilUsuario({ rol = 'atleta' }) {
  const esAtleta = rol === 'atleta';
  // Atleta: 2 contactos de emergencia. Entrenador / admin: 1 solo contacto.
  const cantidadContactos = esAtleta ? 2 : 1;

  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [borrador, setBorrador] = useState(DATOS_INICIALES);
  const [bloqueos, setBloqueos] = useState(BLOQUEOS_INICIALES);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardandoFoto, setGuardandoFoto] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  const [modal, setModal] = useState(null); // 'foto' | 'confirmar' | null

  const [notificaciones, setNotificaciones] = useState(true);
  const [correos, setCorreos] = useState(true);

  const navigate = useNavigate();
  const { aviso, mostrarAviso } = useAviso();

  const usuario = useUsuario();
  const nombreCompleto = usuario.nombre || (usuario.cargando ? '' : 'Usuario');
  const apellido = usuario.apellido || '';
  const inicialesUsuario = iniciales(nombreCompleto);

  // Carga el perfil real desde Supabase al montar
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const fila = await cargarPerfilPropio();
        const correoAuth = user?.email ?? '';

        const cargados = fila
          ? perfilDesdeFila(fila, correoAuth)
          : { ...DATOS_INICIALES, correo: correoAuth };

        setDatos(cargados);
        setBorrador(cargados);
        setBloqueos({
          genero: !!fila?.genero_editado,
          fechaNacimiento: !!fila?.fecha_nacimiento_editada,
          numeroDocumento: !!fila?.numero_documento_editado,
        });

        // El bucket "certificados" es privado: se genera un enlace firmado
        // temporal para poder ver/descargar el certificado ya guardado.
        if (cargados.certificadoEpsPath) {
          const { data: firmada } = await supabase.storage
            .from('certificados')
            .createSignedUrl(cargados.certificadoEpsPath, 60 * 60); // 1 hora

          if (firmada?.signedUrl) {
            setDatos((prev) => ({ ...prev, certificadoEpsUrl: firmada.signedUrl }));
            setBorrador((prev) => ({ ...prev, certificadoEpsUrl: firmada.signedUrl }));
          }
        }
      } catch (err) {
        mostrarAviso('No pudimos cargar tu perfil.', 'error');
      } finally {
        setCargandoPerfil(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vista = editando ? borrador : datos;

  const editable = (campo) => editando && !bloqueos[campo];

  const cambiosUnaVez = CAMPOS_UNA_VEZ.filter(
    (c) => !bloqueos[c] && borrador[c] !== datos[c]
  );

  /* ---- handlers de edición ---- */

  const cambiar = (campo, valor) =>
    setBorrador((prev) => ({ ...prev, [campo]: valor }));

  const cambiarContacto = (indice, campo, valor) =>
    setBorrador((prev) => ({
      ...prev,
      contactos: prev.contactos.map((c, i) => (i === indice ? { ...c, [campo]: valor } : c)),
    }));

  const activarEdicion = () => {
    setBorrador(datos);
    setErrorGuardar('');
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setBorrador(datos);
    setEditando(false);
  };

  const cambiarArchivoEps = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBorrador((prev) => ({
      ...prev,
      certificadoEpsNombre: file.name,
      certificadoEpsArchivo: file,
    }));
  };

  const confirmarGuardar = async () => {
    setGuardando(true);
    setErrorGuardar('');
    try {
      // Si el usuario eligió un archivo nuevo de certificado EPS, se sube primero
      // a Storage (bucket "certificados", privado) y se genera un enlace firmado
      // temporal para poder mostrarlo/abrirlo de inmediato.
      let certificadoEpsPath = borrador.certificadoEpsPath;
      let certificadoEpsUrl = borrador.certificadoEpsUrl;

      if (borrador.certificadoEpsArchivo) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No hay sesión');

        const archivo = borrador.certificadoEpsArchivo;
        const extension = archivo.name.split('.').pop();
        const ruta = `${user.id}/certificado-eps.${extension}`;

        const { error: errSubida } = await supabase.storage
          .from('certificados')
          .upload(ruta, archivo, { upsert: true });

        if (errSubida) throw errSubida;

        const { data: firmada, error: errFirma } = await supabase.storage
          .from('certificados')
          .createSignedUrl(ruta, 60 * 60); // 1 hora, solo para mostrar tras guardar

        if (errFirma) throw errFirma;

        certificadoEpsPath = ruta;
        certificadoEpsUrl = firmada.signedUrl;
      }

      await guardarPerfilPropio({
        tipo_documento: borrador.tipoDocumento,
        numero_documento: borrador.numeroDocumento,
        genero: borrador.genero,
        fecha_nacimiento: borrador.fechaNacimiento || null,
        telefono: borrador.telefono,
        eps: borrador.eps,
        certificado_eps_nombre: borrador.certificadoEpsNombre,
        contactos: borrador.contactos.slice(0, cantidadContactos),
      });

      // Si el correo cambió, se actualiza aparte vía supabase.auth.updateUser
      if (borrador.correo !== datos.correo) {
        const { error: errCorreo } = await supabase.auth.updateUser({ email: borrador.correo });
        if (errCorreo) throw errCorreo;
      }

      const actualizado = {
        ...borrador,
        certificadoEpsPath,
        certificadoEpsUrl,
        certificadoEpsArchivo: null,
      };
      setDatos(actualizado);
      setBorrador(actualizado);
      setBloqueos((prev) => {
        const siguiente = { ...prev };
        cambiosUnaVez.forEach((c) => { siguiente[c] = true; });
        return siguiente;
      });
      setEditando(false);
      setModal(null);
      mostrarAviso('Cambios guardados con éxito', 'ok');
    } catch (err) {
      setErrorGuardar(err.message || 'No pudimos guardar los cambios. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  // Sube la foto al bucket "avatares" (público) y guarda la URL en perfiles.foto_url
  const guardarFoto = async (archivo) => {
    if (!archivo) return;
    setGuardandoFoto(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No hay sesión');

      const extension = archivo.name.split('.').pop();
      const ruta = `${user.id}/avatar.${extension}`;

      const { error: errSubida } = await supabase.storage
        .from(BUCKET_AVATARES)
        .upload(ruta, archivo, { upsert: true, contentType: archivo.type });
      if (errSubida) throw errSubida;

      const { data: publica } = supabase.storage.from(BUCKET_AVATARES).getPublicUrl(ruta);
      // se agrega un parámetro para evitar que el navegador muestre una versión cacheada anterior
      const fotoUrl = `${publica.publicUrl}?t=${Date.now()}`;

      const { error: errUpdate } = await supabase
        .from('perfiles')
        .upsert({ id: user.id, foto_url: fotoUrl }, { onConflict: 'id' });
      if (errUpdate) throw errUpdate;

      setDatos((prev) => ({ ...prev, fotoUrl }));
      setBorrador((prev) => ({ ...prev, fotoUrl }));
      setModal(null);
      mostrarAviso('Foto de perfil actualizada', 'ok');
    } catch (err) {
      mostrarAviso(err.message || 'No pudimos actualizar la foto.', 'error');
    } finally {
      setGuardandoFoto(false);
    }
  };

  const avisoUnaVez = (campo) =>
    bloqueos[campo]
      ? 'Ya no se puede modificar.'
      : editando
        ? 'Solo se puede editar una vez.'
        : null;

  /* ---- render ---- */

  return (
    <div className="perfil-pagina">
      <main className="perfil-main">
        <div className="perfil-contenedor">

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
            <div className="tarjeta-p tarjeta-p--fila">
              <div className="perfil-encabezado-foto">
                <div className="foto-contenedor">
                  <figure className="foto-circulo">
                    {datos.fotoUrl ? (
                      <img src={datos.fotoUrl} alt="Foto de perfil" />
                    ) : (
                      <span className="foto-circulo__vacia" aria-hidden="true">{inicialesUsuario}</span>
                    )}
                  </figure>
                  <button
                    className="foto-lapiz" type="button"
                    title="Cambiar foto de perfil" aria-label="Cambiar foto de perfil"
                    onClick={() => setModal('foto')}
                  >
                    <Pencil size={13} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="perfil-encabezado-info">
                  <h2 className="perfil-nombre">{nombreCompleto}</h2>
                  {apellido && <p className="perfil-apellido">{apellido}</p>}
                  <div className="perfil-insignias">
                    <span className="insignia-rol">{ETIQUETA_ROL[rol]}</span>

                    {esAtleta && (
                      <a href="#" className="poliza-link" title="Ver mi póliza">
                        <FileText size={13} />
                        Mi póliza
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="perfil-encabezado-acciones">
                {!editando ? (
                  <button type="button" className="btn btn-secundario" onClick={activarEdicion}>
                    <Pencil size={15} />
                    Editar información
                  </button>
                ) : (
                  <>
                    <button type="button" className="btn btn-primario" onClick={() => setModal('confirmar')}>
                      <Save size={15} />
                      Guardar cambios
                    </button>
                    <button type="button" className="btn-texto" onClick={cancelarEdicion}>
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Seguridad + Preferencias, lado a lado */}
            <div className="perfil-fila-doble">
              <div className="tarjeta-p tarjeta-p--lateral">
                <TituloSeccion
                  icono={Shield}
                  titulo="Seguridad"
                  sub="Protege tu cuenta y mantén tu información segura"
                />
                <button
                  type="button" className="btn btn-outline-rojo btn-bloque"
                  onClick={() => navigate('/acceso?view=pantalla-recuperar-3')}
                >
                  <Lock size={15} />
                  Cambiar contraseña
                </button>
              </div>

              <div className="tarjeta-p tarjeta-p--lateral">
                <TituloSeccion icono={Bell} titulo="Preferencias de comunicación" />

                <div className="preferencia-item">
                  <div className="preferencia-item__texto">
                    <span className="preferencia-item__titulo">Notificaciones</span>
                    <span className="preferencia-item__sub">Recibe notificaciones del sistema</span>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox" checked={notificaciones}
                      onChange={(e) => setNotificaciones(e.target.checked)}
                    />
                    <span className="toggle__pista" />
                  </label>
                </div>

                <div className="preferencia-item">
                  <div className="preferencia-item__texto">
                    <span className="preferencia-item__titulo">Correos</span>
                    <span className="preferencia-item__sub">Recibe correos importantes</span>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox" checked={correos}
                      onChange={(e) => setCorreos(e.target.checked)}
                    />
                    <span className="toggle__pista" />
                  </label>
                </div>
              </div>
            </div>

            {/* Información personal */}
            <div className="tarjeta-p">
              <TituloSeccion
                icono={User}
                titulo="Información personal"
                sub="Actualiza tus datos personales y de contacto"
              />
              <div className="divisor" />

              <div className="campos-grid">

                <Campo id="tipo-documento" label="Tipo de documento" icono={User}>
                  <select
                    id="tipo-documento" value={vista.tipoDocumento} disabled={!editando}
                    onChange={(e) => cambiar('tipoDocumento', e.target.value)}
                  >
                    {TIPOS_DOCUMENTO.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Campo>

                <Campo
                  id="numero-doc" label="Número de documento" icono={CreditCard}
                  aviso={avisoUnaVez('numeroDocumento')}
                >
                  <input
                    type="text" id="numero-doc" inputMode="numeric"
                    value={vista.numeroDocumento} disabled={!editable('numeroDocumento')}
                    onChange={(e) => cambiar('numeroDocumento', e.target.value.replace(/\D/g, ''))}
                  />
                </Campo>

                <Campo id="genero" label="Género" icono={VenusAndMars} aviso={avisoUnaVez('genero')}>
                  <select
                    id="genero" value={vista.genero} disabled={!editable('genero')}
                    onChange={(e) => cambiar('genero', e.target.value)}
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    {GENEROS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Campo>

                <Campo
                  id="fecha-nacimiento" label="Fecha de nacimiento" icono={Calendar}
                  aviso={avisoUnaVez('fechaNacimiento')}
                >
                  <input
                    type="date" id="fecha-nacimiento"
                    max={new Date().toISOString().split('T')[0]}
                    value={vista.fechaNacimiento} disabled={!editable('fechaNacimiento')}
                    onChange={(e) => cambiar('fechaNacimiento', e.target.value)}
                  />
                </Campo>

                <Campo id="registro-correo" label="Correo electrónico" icono={Mail}>
                  <input
                    type="email" id="registro-correo" value={vista.correo} disabled={!editando}
                    onChange={(e) => cambiar('correo', e.target.value)}
                  />
                </Campo>

                <Campo id="telefono-personal" label="Teléfono" icono={Phone}>
                  <input
                    type="tel" id="telefono-personal" value={vista.telefono} disabled={!editando}
                    onChange={(e) => cambiar('telefono', e.target.value)}
                  />
                </Campo>

                <Campo id="eps-nombre" label="Nombre de EPS" icono={Heart}>
                  <select
                    id="eps-nombre" value={vista.eps} disabled={!editando}
                    onChange={(e) => cambiar('eps', e.target.value)}
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    {EPS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Campo>

                <div className="form-grupo">
                  <label>Certificado de EPS</label>
                  <div className="campo-archivo-visualizacion">
                    <File size={16} />
                    {vista.certificadoEpsUrl ? (
                      <a
                        className="nombre-archivo nombre-archivo--enlace"
                        href={vista.certificadoEpsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {vista.certificadoEpsNombre || 'Ver certificado'}
                      </a>
                    ) : (
                      <span className="nombre-archivo">{vista.certificadoEpsNombre || 'Sin certificado'}</span>
                    )}
                    {editando && (
                      <label className="boton-archivo--perfil" htmlFor="eps-certificado-perfil">
                        Cambiar archivo
                        <input
                          type="file" id="eps-certificado-perfil" hidden
                          accept=".pdf,.jpg,.jpeg,.png" onChange={cambiarArchivoEps}
                        />
                      </label>
                    )}
                  </div>
                </div>

              </div>
            </div>

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

        <Modal
          abierto={modal === 'confirmar'} onCerrar={() => setModal(null)}
          className="perfil-modal--chico" labelledBy="perfil-modal-confirmar-titulo"
        >
          <div className="perfil-modal-cabeza perfil-modal-cabeza--simple">
            <h2 className="perfil-modal-titulo" id="perfil-modal-confirmar-titulo">¿Guardar cambios?</h2>
            <button className="perfil-modal-cerrar" type="button" onClick={() => setModal(null)} aria-label="Cerrar">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          <p className="perfil-modal-descripcion">
            Se actualizará tu información personal. ¿Confirmas los cambios realizados?
          </p>

          {cambiosUnaVez.length > 0 && (
            <p className="perfil-modal-advertencia" role="alert">
              <Lock size={14} />
              <span>
                Vas a modificar{' '}
                <strong>{cambiosUnaVez.map((c) => ETIQUETA_CAMPO[c].toLowerCase()).join(', ')}</strong>.
                Después de guardar no podrás volver a cambiarlo.
              </span>
            </p>
          )}

          {errorGuardar && <p className="estado-carga estado-carga--error" role="alert">{errorGuardar}</p>}

          <div className="perfil-modal-pie">
            <button className="btn btn-blanco" type="button" onClick={() => setModal(null)}>
              Cancelar
            </button>
            <button
              className="btn btn-primario" type="button" disabled={guardando}
              onClick={async () => { await confirmarGuardar(); }}
            >
              {guardando ? 'Guardando…' : 'Sí, guardar'}
            </button>
          </div>
        </Modal>
      </main>

      <AvisoToast aviso={aviso} />
    </div>
  );
}