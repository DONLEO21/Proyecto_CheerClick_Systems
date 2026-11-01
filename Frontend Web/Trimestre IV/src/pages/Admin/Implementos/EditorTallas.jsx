import { ETIQUETA_GRUPO, TALLAS_POR_GRUPO, gruposDeTipo, ordenarTallas, totalStock } from "../../../data/tallas";
import "../../../components/Tallas/Tallas.css";

export default function EditorTallas({ tipo, value = [], onChange }) {
  if (!tipo) {
    return (
      <div className="talla-editor">
        <p className="talla-ayuda">Seleccione un tipo para configurar las tallas.</p>
      </div>
    );
  }

  const stockDe = (grupo, talla) => value.find((t) => t.grupo === grupo && t.talla === talla)?.stock;

  const cambiar = (grupo, talla, texto) => {
    const resto = value.filter((t) => !(t.grupo === grupo && t.talla === talla));
    if (texto === "") {
      onChange(ordenarTallas(resto));
      return;
    }
    const stock = Math.max(0, parseInt(texto, 10) || 0);
    onChange(ordenarTallas([...resto, { grupo, talla, stock }]));
  };

  return (
    <div className="talla-editor">
      {gruposDeTipo(tipo).map((grupo) => (
        <div className="talla-editor-grupo" key={grupo}>
          <span className="talla-grupo-titulo">{ETIQUETA_GRUPO[grupo]}</span>
          <div className="talla-editor-grid">
            {TALLAS_POR_GRUPO[grupo].map((talla) => {
              const stock = stockDe(grupo, talla);
              return (
                <label
                  key={talla}
                  className={`talla-editor-item ${stock !== undefined ? "talla-editor-item--activa" : ""}`}
                >
                  <span className="talla-editor-etiqueta">{talla}</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="–"
                    aria-label={`Unidades de la talla ${talla}`}
                    value={stock ?? ""}
                    onChange={(e) => cambiar(grupo, talla, e.target.value)}
                  />
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="talla-editor-pie">
        <p className="talla-ayuda">Deje vacía la talla que no se ofrece. Con 0 aparece como agotada.</p>
        <span className="talla-total">
          Cantidad total: <strong>{totalStock(value)}</strong>
        </span>
      </div>
    </div>
  );
}