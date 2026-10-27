import { Calendar } from 'lucide-react';
import { fechaLocal, hora12, mayus } from './dashboardAtletaData.js';

function formatearProximo(proximo) {
  if (!proximo) return null;
  const f = fechaLocal(proximo.fecha);
  const diaSemana = mayus(f.toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', ''));
  return {
    fecha: `${diaSemana} ${f.getDate()} · ${hora12(proximo.hora_inicio)}`,
    tipo: proximo.titulo || 'Entrenamiento',
  };
}

export default function TarjetaPerfilAtleta({
  nombre, foto, nivel, entrenamientos, torneosInscritos, proximo,
}) {
  const iniciales = nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
  const prox = formatearProximo(proximo);

  return (
    <article className="tarjeta-dashboard tarjeta-perfil-atleta">
      <div className="tarjeta-dashboard__contenido perfil-atleta">
        <figure className="perfil-atleta__foto">
          {foto ? (
            <img src={foto} alt={`Foto de ${nombre}`} />
          ) : (
            <span className="perfil-atleta__foto-vacia" aria-hidden="true">{iniciales}</span>
          )}
        </figure>
        <h3 className="perfil-atleta__nombre">{nombre}</h3>
        <span className="insignia-categoria">{nivel}</span>

        <div className="perfil-atleta__stats">
          <div className="perfil-atleta__stat">
            <span className="perfil-atleta__stat-valor">{entrenamientos}</span>
            <span className="perfil-atleta__stat-etiqueta">Entrenamientos</span>
          </div>
          <div className="perfil-atleta__stat">
            <span className="perfil-atleta__stat-valor">{torneosInscritos}</span>
            <span className="perfil-atleta__stat-etiqueta">Torneos inscritos</span>
          </div>
        </div>

        <div className="perfil-atleta__proximo">
          <div className="perfil-atleta__proximo-etiqueta">
            <Calendar size={14} strokeWidth={2} /> Próximo entrenamiento
          </div>
          <div className="perfil-atleta__proximo-info">
            {prox ? (
              <>
                <span className="perfil-atleta__proximo-fecha">{prox.fecha}</span>
                <span className="perfil-atleta__proximo-tipo">{prox.tipo}</span>
              </>
            ) : (
              <span className="perfil-atleta__proximo-tipo">Sin entrenamientos próximos</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}