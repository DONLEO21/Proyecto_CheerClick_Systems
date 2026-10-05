import { useState } from 'react';
import { Bell } from 'lucide-react';

export default function TarjetaPreferencias() {
  const [notificaciones, setNotificaciones] = useState(true);
  const [correos, setCorreos] = useState(true);

  return (
    <div className="tarjeta-p tarjeta-p--lateral">
      <div className="seccion-titulo">
        <span className="seccion-titulo__icono"><Bell size={17} /></span>
        <div>
          <h3>Preferencias de comunicación</h3>
        </div>
      </div>

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
  );
}