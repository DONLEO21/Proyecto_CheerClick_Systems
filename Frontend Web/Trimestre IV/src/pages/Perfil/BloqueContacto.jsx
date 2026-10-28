import { User, Phone, Users } from 'lucide-react';
import Campo from './Campo.jsx';
import { PARENTESCOS } from './perfilData.js';

export default function BloqueContacto({ numero, contacto, editando, onCambio }) {
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