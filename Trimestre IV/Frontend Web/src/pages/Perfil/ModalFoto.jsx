import { useEffect, useRef, useState } from 'react';
import { X, CloudUpload } from 'lucide-react';
import Modal from './Modal.jsx';
import { MAX_FOTO, TIPOS_FOTO } from './perfilData.js';

export default function ModalFoto({ abierto, fotoActual, iniciales: iniIniciales, onCerrar, onGuardar, guardando }) {
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