import { Pencil, Save, FileText } from 'lucide-react';
import { ETIQUETA_ROL } from './perfilData.js';

export default function TarjetaEncabezado({
  rol, esAtleta, fotoUrl, inicialesUsuario, nombreCompleto, apellido,
  editando, onCambiarFoto, onEditar, onGuardar, onCancelar,
}) {
  return (
    <div className="tarjeta-p tarjeta-p--fila">
      <div className="perfil-encabezado-foto">
        <div className="foto-contenedor">
          <figure className="foto-circulo">
            {fotoUrl ? (
              <img src={fotoUrl} alt="Foto de perfil" />
            ) : (
              <span className="foto-circulo__vacia" aria-hidden="true">{inicialesUsuario}</span>
            )}
          </figure>
          <button
            className="foto-lapiz" type="button"
            title="Cambiar foto de perfil" aria-label="Cambiar foto de perfil"
            onClick={onCambiarFoto}
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
          <button type="button" className="btn btn-secundario" onClick={onEditar}>
            <Pencil size={15} />
            Editar información
          </button>
        ) : (
          <>
            <button type="button" className="btn btn-primario" onClick={onGuardar}>
              <Save size={15} />
              Guardar cambios
            </button>
            <button type="button" className="btn-texto" onClick={onCancelar}>
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}