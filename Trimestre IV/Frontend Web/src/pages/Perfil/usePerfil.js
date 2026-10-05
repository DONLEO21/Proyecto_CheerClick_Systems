import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { cargarPerfilPropio, guardarPerfilPropio } from '../../services/perfil';
import {
  CAMPOS_UNA_VEZ, BUCKET_AVATARES, DATOS_INICIALES, BLOQUEOS_INICIALES, perfilDesdeFila,
} from './perfilData.js';

export default function usePerfil({ rol, mostrarAviso }) {
  // Atleta: 2 contactos de emergencia. Entrenador / admin: 1 solo contacto.
  const cantidadContactos = rol === 'atleta' ? 2 : 1;

  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [borrador, setBorrador] = useState(DATOS_INICIALES);
  const [bloqueos, setBloqueos] = useState(BLOQUEOS_INICIALES);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardandoFoto, setGuardandoFoto] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');
  const [cargandoPerfil, setCargandoPerfil] = useState(true);

  const [modal, setModal] = useState(null); // 'foto' | 'confirmar' | null

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

  return {
    datos, vista, bloqueos, editando, guardando, guardandoFoto,
    errorGuardar, cargandoPerfil, modal, setModal,
    cantidadContactos, cambiosUnaVez,
    cambiar, cambiarContacto, cambiarArchivoEps,
    activarEdicion, cancelarEdicion, confirmarGuardar, guardarFoto,
  };
}