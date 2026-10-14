import { Wallet } from 'lucide-react';
import { moneda, fechaCorta } from './dashboardAtletaData.js';

function textoDias(dias) {
  if (dias < 0) return ` (${Math.abs(dias)} d de retraso)`;
  if (dias === 0) return ' (hoy)';
  return ` (en ${dias} d)`;
}

export default function TarjetaMensualidades({ pagos, onVer }) {
  const { ultimo, siguiente, estado, dias } = pagos;

  return (
    <article className="tarjeta-dashboard tarjeta-mensualidades">
      <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
        <Wallet size={24} strokeWidth={2} /><h2>Mensualidades</h2>
      </header>

      <div className="tarjeta-dashboard__contenido pagos">
        <div className="pago-item">
          <span className="pago-item__etiqueta">Último pago</span>
          {ultimo ? (
            <>
              <strong className="pago-item__valor">{moneda(ultimo.valor)}</strong>
              <span className="pago-item__detalle">{ultimo.mes} · {fechaCorta(ultimo.fecha_pago)}</span>
            </>
          ) : <span className="pago-item__detalle">Sin pagos registrados</span>}
        </div>

        <div className={`pago-item pago-item--${estado === 'aldia' ? 'neutro' : estado}`}>
          <span className="pago-item__etiqueta">Próximo pago</span>
          {siguiente ? (
            <>
              <strong className="pago-item__valor">{moneda(siguiente.valor)}</strong>
              <span className="pago-item__detalle">
                {siguiente.mes} · vence {fechaCorta(siguiente.fecha_vencimiento)}
                {dias !== null && <em>{textoDias(dias)}</em>}
              </span>
            </>
          ) : <span className="pago-item__detalle">No tienes pagos pendientes</span>}
        </div>
      </div>

      <button type="button" className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--completo"
        onClick={onVer}>
        Ver mis mensualidades
      </button>
    </article>
  );
}