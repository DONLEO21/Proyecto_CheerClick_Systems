import { agruparTallas, ETIQUETA_GRUPO } from "../../../data/tallas";
import "../../../components/Tallas/Tallas.css";

// Las tallas agotadas aparecen deshabilitadas.
export default function SelectorTalla({ tallas = [], seleccion, onSeleccionar }) {
  const grupos = agruparTallas(tallas);
  const conTitulo = grupos.length > 1;

  return (
    <div className="talla-selector" role="radiogroup" aria-label="Talla">
      {grupos.map(({ grupo, items }) => (
        <div className="talla-selector-grupo" key={grupo}>
          {conTitulo && <span className="talla-grupo-titulo">{ETIQUETA_GRUPO[grupo] ?? grupo}</span>}
          <div className="talla-selector-opciones">
            {items.map((t) => {
              const agotada = Number(t.stock) <= 0;
              const activa = seleccion?.grupo === t.grupo && seleccion?.talla === t.talla;
              return (
                <button
                  key={`${t.grupo}-${t.talla}`}
                  type="button"
                  role="radio"
                  aria-checked={activa}
                  disabled={agotada}
                  title={agotada ? "Agotada" : `${t.stock} unidad(es) disponibles`}
                  className={`talla-chip talla-chip--selector ${activa ? "talla-chip--activa" : ""} ${agotada ? "talla-chip--agotada" : ""}`}
                  onClick={() => onSeleccionar(t)}
                >
                  {t.talla}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {seleccion && (
        <p className="talla-stock-info">
          Talla {seleccion.talla}: {seleccion.stock} unidad(es) disponibles
        </p>
      )}
    </div>
  );
}