function NotasEntrenador({ notas }) {
  return (
    <section className="notas-entrenador">
      <h3>Notas del Entrenador</h3>

      {notas.length > 0 ? (
        notas.map((nota) => (
          <div className="nota-card" key={nota.id}>
            <div className="nota-card__fecha">
              {nota.fecha} · {nota.autor}
            </div>
            <p className="nota-card__texto">{nota.texto}</p>
          </div>
        ))
      ) : (
        <p className="rend-vacio rend-vacio--izq">Sin notas registradas por el entrenador.</p>
      )}
    </section>
  );
}

export default NotasEntrenador;