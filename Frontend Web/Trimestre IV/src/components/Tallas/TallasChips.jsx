import { agruparTallas, ETIQUETA_GRUPO } from "../../data/tallas";
import "./Tallas.css";

// Muestra las tallas de un implemento
export default function TallasChips({ tallas = [], mostrarStock = false, maximo = Infinity, vacio = "—" }) {
  const grupos = agruparTallas(tallas);
  if (grupos.length === 0) return <span className="talla-vacio">{vacio}</span>;

  const conTitulo = grupos.length > 1;

  const todas = grupos.flatMap((g) => g.items);
  const mostradas = todas.slice(0, maximo);
  const visibles = grupos
    .map(({ grupo, items }) => ({ grupo, items: items.filter((t) => mostradas.includes(t)) }))
    .filter((g) => g.items.length > 0);
  const ocultas = todas.length - mostradas.length;

  return (
    <div className="talla-grupos">
      {visibles.map(({ grupo, items }) => (
        <div className="talla-grupo-linea" key={grupo}>
          {conTitulo && <span className="talla-grupo-titulo">{ETIQUETA_GRUPO[grupo] ?? grupo}</span>}
          {items.map((t) => {
            const agotada = Number(t.stock) <= 0;
            return (
              <span
                key={`${t.grupo}-${t.talla}`}
                className={`talla-chip ${agotada ? "talla-chip--agotada" : ""}`}
                title={agotada ? `Talla ${t.talla}: agotada` : `Talla ${t.talla}: ${t.stock} unidad(es)`}
              >
                {t.talla}
                {mostrarStock && <span className="talla-chip-stock">{t.stock}</span>}
              </span>
            );
          })}
        </div>
      ))}
      {ocultas > 0 && <span className="talla-mas">+{ocultas} más</span>}
    </div>
  );
}