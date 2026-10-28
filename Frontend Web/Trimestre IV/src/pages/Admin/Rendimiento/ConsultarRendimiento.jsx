import { useEffect, useMemo, useState } from "react";
import imgusuario from "../../../assets/icons/usuarios.png";
import { obtenerEstiloNivel } from "../../../components/utils/nivelEstilos";
import "./ConsultarRendimiento.css";
import 'bootstrap-icons/font/bootstrap-icons.css';



const PESTANAS = [
  { key: "apropiada", label: "Apropiadas",  icon: <i class="bi bi-stars"></i> },
  { key: "avanzada", label: "Avanzadas", icon: <i class="bi bi-arrow-up-right"></i> },
  { key: "elite", label: "Élite", icon: <i class="bi bi-trophy"></i> },
];

function ConsultarRendimiento({ atleta, onVolver }) {
  const [habilidades, setHabilidades] = useState([]);
  const [progreso, setProgreso] = useState([]);
  const [notas, setNotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nivelActivo, setNivelActivo] = useState("apropiada");
  const [busquedaHabilidad, setBusquedaHabilidad] = useState("");

  useEffect(() => {
  if (!atleta) return;

  setCargando(true);

  Promise.all([
    fetch("http://localhost:3001/habilidades", { cache: "no-store" }).then((res) => res.json()),
    fetch("http://localhost:3001/progresoHabilidades", { cache: "no-store" }).then((res) =>
      res.json()
    ),
    fetch("http://localhost:3001/notas", { cache: "no-store" }).then((res) => res.json()),
  ])
    .then(([datosHabilidades, datosProgreso, datosNotas]) => {
      const progresoDelAtleta = Array.isArray(datosProgreso)
        ? datosProgreso.filter((p) => p.atletaId === atleta.id)
        : [];

      const notasDelAtleta = Array.isArray(datosNotas)
        ? datosNotas.filter((n) => n.atletaId === atleta.id)
        : [];

      setHabilidades(Array.isArray(datosHabilidades) ? datosHabilidades : []);
      setProgreso(progresoDelAtleta);
      setNotas(notasDelAtleta);
    })
    .catch((error) => {
      console.error("Error al cargar datos:", error);
      setHabilidades([]);
      setProgreso([]);
      setNotas([]);
    })
    .finally(() => setCargando(false));
}, [atleta]);

  


  const habilidadesDelAtleta = useMemo(() => {
    return habilidades

      .map((h) => {
        const registro = progreso.find((p) => p.habilidadId === h.id);
        return {
          ...h,
          completado: registro ? registro.completado : false,
        };
      });
  }, [habilidades, progreso, atleta]);

  const habilidadesCompletadas = habilidadesDelAtleta.filter((h) => h.completado).length;

  const habilidadesFiltradas = useMemo(() => {
    return habilidadesDelAtleta
      .filter((h) => h.categoria === nivelActivo)
      .filter((h) => h.texto.toLowerCase().includes(busquedaHabilidad.toLowerCase().trim()));
  }, [habilidadesDelAtleta, nivelActivo, busquedaHabilidad]);

  if (!atleta) return null;

  return (
    <main id="conteni" className="mt-3">
      <aside id="conte-infor">
        <div>
          <img id="foto" src={imgusuario} alt="Foto Atleta" />
        </div>
        <div>
          <h3>Detalle del Atleta</h3>
          <h4>{atleta.nombre}</h4>
          <h5>
            Edad: {atleta.edad} -{" "}
            <button className="btn-nivel btn btn-sm border-0" style={obtenerEstiloNivel(atleta.nivel)}>
              {atleta.nivel}
            </button>
          </h5>
        </div>
      </aside>

      <section id="targetas-consulta">
        <div className="targe">
          <h4 className="titu">Puntaje Total</h4>
          <div className="conte-targe">
            <span className="valor">{atleta.rendimiento}%</span>
          </div>
        </div>

        <div className="targe">
          <h4 className="titu">Habilidades</h4>
          <div className="conte-targe">
            <span className="valor-tex">
              {habilidadesCompletadas} / {habilidadesDelAtleta.length}
            </span>
          </div>
        </div>

        <div className="targe">
          <h4 className="titu">Asistencia</h4>
          <div className="conte-targe">
            <span className="valor-tex">
              0
            </span>
          </div>
        </div>

      </section>

      <section id="panel-infor">
        <div id="conte-esta">
          <h3>Desempeño</h3>

          <section id="fil-busque">
            <input
              type="search"
              placeholder="Buscar Habilidad..."
              className="search-input"
              value={busquedaHabilidad}
              onChange={(e) => setBusquedaHabilidad(e.target.value)}
            />
            <div id="bnt">
              {PESTANAS.map((pestana) => (
                <button
                  key={pestana.key}
                  type="button"
                  className={`btn-pestana ${nivelActivo === pestana.key ? "activo" : ""}`}
                  onClick={() => setNivelActivo(pestana.key)}
                >
                  {pestana.icon}
                  {pestana.label}
                </button>
              ))}
            </div>
          </section>

          <section id="habilidades">
            {cargando ? (
              <p className="text-muted text-center py-4">Cargando habilidades...</p>
            ) : (
              <div className="grid-habi">
                {habilidadesFiltradas.length > 0 ? (
                  habilidadesFiltradas.map((h) => (
                    <div className="targe-habi" key={h.id}>
                      <div>
                        <span className="tex-habi">{h.texto}</span>
                      </div>
                      <div className="conte-btn-habi">
                        {h.completado ? (
                          <button className="btn-completado" type="button">
                            Completado
                          </button>
                        ) : (
                          <button className="btn-completad" type="button">
                            No logrado
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center py-4">
                    No hay habilidades registradas para este nivel.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </section>
      <footer id="notas-entre">
        <h3>Notas del Entrenador</h3>
        {notas.length > 0 ? (
          notas.map((nota) => (
            <div className="targe-notas" key={nota.id}>
              <span className="titu-notas">
                {nota.fecha} — {nota.autor}
              </span>
              <p className="texto-notas">{nota.texto}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">Sin notas registradas para este atleta.</p>
        )}
      </footer>
    </main>
  );
}

export default ConsultarRendimiento;
