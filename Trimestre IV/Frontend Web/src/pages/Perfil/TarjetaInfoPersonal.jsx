import {
  User, CreditCard, Mail, Phone, Heart, File, Calendar, VenusAndMars,
} from 'lucide-react';
import Campo from './Campo.jsx';
import { TIPOS_DOCUMENTO, GENEROS, EPS } from './perfilData.js';

export default function TarjetaInfoPersonal({
  vista, editando, bloqueos, onCambiar, onCambiarArchivoEps,
}) {
  const editable = (campo) => editando && !bloqueos[campo];

  const avisoUnaVez = (campo) =>
    bloqueos[campo]
      ? 'Ya no se puede modificar.'
      : editando
        ? 'Solo se puede editar una vez.'
        : null;

  return (
    <div className="tarjeta-p">
      <div className="seccion-titulo">
        <span className="seccion-titulo__icono"><User size={17} /></span>
        <div>
          <h3>Información personal</h3>
          <p className="seccion-titulo__sub">Actualiza tus datos personales y de contacto</p>
        </div>
      </div>
      <div className="divisor" />

      <div className="campos-grid">

        <Campo id="tipo-documento" label="Tipo de documento" icono={User}>
          <select
            id="tipo-documento" value={vista.tipoDocumento} disabled={!editando}
            onChange={(e) => onCambiar('tipoDocumento', e.target.value)}
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
            onChange={(e) => onCambiar('numeroDocumento', e.target.value.replace(/\D/g, ''))}
          />
        </Campo>

        <Campo id="genero" label="Género" icono={VenusAndMars} aviso={avisoUnaVez('genero')}>
          <select
            id="genero" value={vista.genero} disabled={!editable('genero')}
            onChange={(e) => onCambiar('genero', e.target.value)}
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
            onChange={(e) => onCambiar('fechaNacimiento', e.target.value)}
          />
        </Campo>

        <Campo id="registro-correo" label="Correo electrónico" icono={Mail}>
          <input
            type="email" id="registro-correo" value={vista.correo} disabled={!editando}
            onChange={(e) => onCambiar('correo', e.target.value)}
          />
        </Campo>

        <Campo id="telefono-personal" label="Teléfono" icono={Phone}>
          <input
            type="tel" id="telefono-personal" value={vista.telefono} disabled={!editando}
            onChange={(e) => onCambiar('telefono', e.target.value)}
          />
        </Campo>

        <Campo id="eps-nombre" label="Nombre de EPS" icono={Heart}>
          <select
            id="eps-nombre" value={vista.eps} disabled={!editando}
            onChange={(e) => onCambiar('eps', e.target.value)}
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
                  accept=".pdf,.jpg,.jpeg,.png" onChange={onCambiarArchivoEps}
                />
              </label>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}