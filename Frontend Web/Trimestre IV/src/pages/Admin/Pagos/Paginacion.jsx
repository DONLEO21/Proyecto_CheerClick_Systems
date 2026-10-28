import React from "react";

function Paginacion({ paginaActual, setPaginaActual, totalItems, itemsPorPagina, etiqueta = "atletas" }) {
  const totalPaginas = Math.ceil(totalItems / itemsPorPagina);

  if (totalPaginas <= 1) return null;

  // Rango dinámico para mostrar máximo 3 números
  let inicioPagina = Math.max(1, paginaActual - 1);
  let finPagina = Math.min(totalPaginas, inicioPagina + 2);

  // Ajuste si estamos cerca de la última página
  if (finPagina - inicioPagina < 2) {
    inicioPagina = Math.max(1, finPagina - 2);
  }

  // Generamos el arreglo de los 3 números a mostrar
  const paginasVisibles = Array.from(
    { length: finPagina - inicioPagina + 1 },
    (_, i) => inicioPagina + i
  );

  const inicioMostrado = (paginaActual - 1) * itemsPorPagina + 1;
  const finMostrado = Math.min(paginaActual * itemsPorPagina, totalItems);

  return (
    <footer className="footer-cont">
      <p className="mb-0 cantidad">
        Mostrando {finMostrado - inicioMostrado + 1} de {totalItems} {etiqueta}
      </p>

      <div id="botones">
        <button
          className="btn-largo"
          onClick={() => setPaginaActual(paginaActual - 1)}
          disabled={paginaActual === 1}
        >
          &larr; Anterior
        </button>

        {paginasVisibles.map((num) => (
          <button
            key={num}
            className={paginaActual === num ? "acti" : "desac"}
            onClick={() => setPaginaActual(num)}
          >
            {num}
          </button>
        ))}

        <button
          className="btn-largo"
          onClick={() => setPaginaActual(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
        >
          Siguiente &rarr;
        </button>
      </div>
    </footer>
  );
}

export default Paginacion;
