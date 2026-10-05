import { MessageCircle } from 'lucide-react';

export default function TarjetaPqrsAtleta({ resumen, onVer }) {
  return (
    <article className="tarjeta-dashboard tarjeta-pqrs">
      <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
        <MessageCircle size={24} strokeWidth={2} /><h2>PQRS</h2>
      </header>
      <div className="tarjeta-dashboard__contenido pqrs__resumen">
        {resumen.map(({ id, texto }) => (
          <span className={`insignia-pqrs insignia-pqrs--${id}`} key={id}>{texto}</span>
        ))}
      </div>
      <button type="button" className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--completo"
        onClick={onVer}>
        Ver mis Solicitudes
      </button>
    </article>
  );
}