import { useMemo, useState } from "react";

// `key` coincide con `categoria` en db.json
const NIVELES = [
  { key: "apropiada", label: "Apropiadas", icon: "bi-stars" },
  { key: "avanzada", label: "Avanzadas", icon: "bi-arrow-up-right" },
  { key: "elite", label: "Élite", icon: "bi-trophy" },
];

/**
 * Panel "Desempeño por habilidades": filtros por nivel + tarjetas.
 *
 * @param {Array}   habilidades  Habilidades con la propiedad `completado`
 * @param {boolean} cargando
 */
function PanelHabilidades({ habilidades, cargando }) {
  const [nivelActivo, setNivelActivo] = useState(NIVELES[0].key);

  const habilidadesFiltradas = useMemo(
    () => habilidades.filter((h) => h.categoria === nivelActivo),
    [habilidades, nivelActivo]
  );

  const iconoNivel = NIVELES.find((n) => n.key === nivelActivo)?.icon;

  return (
    <section className="panel-rendimiento">
      <div className="panel-rendimiento__header">
        <h3>Desempeño por habilidades</h3>

        <div className="filtros-habilidad" role="group" aria-label="Filtrar por nivel">
          {NIVELES.map((nivel) => (
            <button
              key={nivel.key}
              type="button"
              className={`btn-filtro ${nivelActivo === nivel.key ? "btn-filtro--activo" : ""}`}
              onClick={() => setNivelActivo(nivel.key)}
            >
              <i className={`bi ${nivel.icon}`}></i>
              {nivel.label}
            </button>
          ))}
        </div>
      </div>

      {cargando ? (
        <p className="rend-vacio">Cargando habilidades...</p>
      ) : habilidadesFiltradas.length > 0 ? (
        <div className="grid-habilidades">
          {habilidadesFiltradas.map((h) => (
            <div className="tarjeta-habilidad" key={h.id}>
              <div className="tarjeta-habilidad__icono">
                <i className={`bi ${iconoNivel}`}></i>
              </div>

              <span className="tarjeta-habilidad__nombre">{h.texto}</span>

              {h.completado ? (
                <span className="badge-estado badge-estado--completado">
                  <i className="bi bi-check-lg"></i>
                  Completado
                </span>
              ) : (
                <span className="badge-estado badge-estado--pendiente">
                  <i className="bi bi-x-lg"></i>
                  No logrado
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="rend-vacio">No hay habilidades registradas para este nivel.</p>
      )}
    </section>
  );
}

export default PanelHabilidades;