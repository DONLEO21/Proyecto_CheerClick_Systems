import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { guardarPerfilPropio } from '../../services/perfil';
import { limpiarCacheUsuario } from '../../hooks/useUsuario';
import {
  CAMPOS_UNA_VEZ, BUCKET_AVATARES, DATOS_INICIALES, BLOQUEOS_INICIALES, perfilDesdeFila,
} from './perfilData.js';

// Caché en memoria: evita repetir consultas al navegar entre pantallas //
let cache = null;
supabase.auth.onAuthStateChange((evento) => {
  if (evento === 'SIGNED_OUT') cache = null;
});

// Reduce la foto a 512px y la convierte a JPG para que suba y cargue rápido
async function comprimirImagen(archivo, lado = 512, calidad = 0.85) {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, lado / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // PNG con transparencia -> fondo blanco
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', calidad));
  return blob ?? archivo;
}

export default function usePerfil({ rol, mostrarAviso }) {
  // Atleta: 2 contactos de emergencia. Entrenador y admin: 1 solo contacto.
  const cantidadContactos = rol === 'atleta' ? 2 : 1;

  const [datos, setDatos] = useState(() => cache?.datos ?? DATOS_INICIALES);
  const [borrador, setBorrador] = useState(() => cache?.datos ?? DATOS_INICIALES);
  const [bloqueos, setBloqueos] = useState(() => cache?.bloqueos ?? BLOQUEOS_INICIALES);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [guardandoFoto, setGuardandoFoto] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');
  const [cargandoPerfil, setCargandoPerfil] = useState(() => !cache);

  const [modal, setModal] = useState(null); // 'foto' | 'confirmar' | null

  // Carga el perfil real desde Supabase al montar
  useEffect(() => {
    let vivo = true;

    (async () => {
      try {
        // getSession() es local (sin red). La validez de la sesión ya la comprueba Rutaprotegida.
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) throw new Error('No hay sesión');

        const { data: fila, error } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (!vivo) return;

        const correoAuth = user.email ?? '';
        const cargados = fila
          ? perfilDesdeFila(fila, correoAuth)
          : { ...DATOS_INICIALES, correo: correoAuth };
        const bloq = {
          genero: !!fila?.genero_editado,
          fechaNacimiento: !!fila?.fecha_nacimiento_editada,
          numeroDocumento: !!fila?.numero_documento_editado,
        };

        // Conserva la URL firmada si ya se había generado antes
        const urlPrevia = cache?.datos?.certificadoEpsPath === cargados.certificadoEpsPath
          ? cache.datos.certificadoEpsUrl
          : '';
        const inicial = { ...cargados, certificadoEpsUrl: urlPrevia };

        cache = { datos: inicial, bloqueos: bloq };
        setDatos(inicial);
        setBorrador(inicial);
        setBloqueos(bloq);
        setCargandoPerfil(false); // el formulario aparece YA

        // El certificado (bucket privado) se firma después, sin bloquear la pantalla
        if (cargados.certificadoEpsPath && !urlPrevia) {
          const { data: firmada } = await supabase.storage
            .from('certificados')
            .createSignedUrl(cargados.certificadoEpsPath, 60 * 60);

          if (vivo && firmada?.signedUrl) {
            setDatos((prev) => ({ ...prev, certificadoEpsUrl: firmada.signedUrl }));
            setBorrador((prev) => ({ ...prev, certificadoEpsUrl: firmada.signedUrl }));
            if (cache) cache.datos = { ...cache.datos, certificadoEpsUrl: firmada.signedUrl };
          }
        }
      } catch (err) {
        if (vivo) {
          mostrarAviso('No pudimos cargar tu perfil.', 'error');
          setCargandoPerfil(false);
        }
      }
    })();

    return () => { vivo = false; };
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
      let certificadoEpsPath = borrador.certificadoEpsPath;
      let certificadoEpsUrl = borrador.certificadoEpsUrl;

      if (borrador.certificadoEpsArchivo) {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
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
          .createSignedUrl(ruta, 60 * 60);
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
      const nuevosBloqueos = { ...bloqueos };
      cambiosUnaVez.forEach((c) => { nuevosBloqueos[c] = true; });

      setDatos(actualizado);
      setBorrador(actualizado);
      setBloqueos(nuevosBloqueos);
      cache = { datos: actualizado, bloqueos: nuevosBloqueos };
      setEditando(false);
      setModal(null);
      mostrarAviso('Cambios guardados con éxito', 'ok');
    } catch (err) {
      setErrorGuardar(err.message || 'No pudimos guardar los cambios. Inténtalo de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  // Sube la foto (comprimida) al bucket de avatares y guarda la URL en perfiles.foto_url
  const guardarFoto = async (archivo) => {
    if (!archivo) return;
    setGuardandoFoto(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) throw new Error('No hay sesión');

      const comprimida = await comprimirImagen(archivo);
      const ruta = `${user.id}/avatar.jpg`;

      const { error: errSubida } = await supabase.storage
        .from(BUCKET_AVATARES)
        .upload(ruta, comprimida, { upsert: true, contentType: 'image/jpeg' });
      if (errSubida) throw errSubida;

      const { data: publica } = supabase.storage.from(BUCKET_AVATARES).getPublicUrl(ruta);
      // parámetro para evitar que el navegador muestre una versión cacheada anterior
      const fotoUrl = `${publica.publicUrl}?t=${Date.now()}`;

      const { error: errUpdate } = await supabase
        .from('perfiles')
        .upsert({ id: user.id, foto_url: fotoUrl }, { onConflict: 'id' });
      if (errUpdate) throw errUpdate;

      setDatos((prev) => ({ ...prev, fotoUrl }));
      setBorrador((prev) => ({ ...prev, fotoUrl }));
      if (cache) cache.datos = { ...cache.datos, fotoUrl };
      limpiarCacheUsuario(); // la cabecera recarga la foto nueva
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