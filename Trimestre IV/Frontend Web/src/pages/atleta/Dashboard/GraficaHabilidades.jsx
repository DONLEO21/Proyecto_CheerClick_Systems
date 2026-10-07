import { TrendingUp } from 'lucide-react';

export default function GraficaHabilidades({ habilidades }) {
  const total = habilidades.length;
  const aprobadas = habilidades.filter((h) => h.estado === 'aprobado').length;
  const porcentaje = total ? Math.round((aprobadas / total) * 100) : 0;
  const radio = 80;
  const circ = 2 * Math.PI * radio;
  const relleno = (circ * porcentaje) / 100;

  return (
    <>
      <svg viewBox="0 0 200 200" className="svg-habilidades" role="img"
        aria-label={`${porcentaje}% de habilidades dominadas`}>
        <circle cx="100" cy="100" r={radio} fill="none" stroke="#f1e6e6" strokeWidth="14" />
        <circle cx="100" cy="100" r={radio} fill="none" stroke="var(--rojo)" strokeWidth="14"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - relleno}
          transform="rotate(-90 100 100)" style={{ transition: 'stroke-dashoffset .5s ease' }} />
        <text x="100" y="96" textAnchor="middle" fontSize="34" fontWeight="700">{porcentaje}%</text>
        <text x="100" y="118" textAnchor="middle" fontSize="12" fill="var(--texto-muted)">Habilidades</text>
        <text x="100" y="132" textAnchor="middle" fontSize="12" fill="var(--texto-muted)">dominadas</text>
      </svg>
      <p className="svg-habilidades__etiqueta">
        <TrendingUp size={14} strokeWidth={2} /> {aprobadas} de {total} habilidades completadas
      </p>
    </>
  );
}