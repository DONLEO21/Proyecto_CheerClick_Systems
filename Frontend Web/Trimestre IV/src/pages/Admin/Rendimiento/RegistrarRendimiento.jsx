import { useEffect, useMemo, useState } from "react";
import imgusuario from "../../../assets/icons/usuarios.png";
import { obtenerEstiloNivel } from "../../../components/utils/nivelEstilos";
import "./RegistrarRendimiento.css";

const API = "http://localhost:3001";

const PESTANAS = [
  { key: "apropiada", label: "Apropiadas", icon: <i className="bi bi-stars"></i> },
  { key: "avanzada", label: "Avanzadas", icon: <i className="bi bi-arrow-up-right"></i> },
  { key: "elite", label: "Élite", icon: <i className="bi bi-trophy"></i> },
];

function obtenerFechaHoy() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function RegistrarRendimiento({ atleta, onVolver }) {
  const [habilidades, setHabilidades] = useState([]);
  const [progresoOriginal, setProgresoOriginal] = useState([]);
  const [progresoEditado, setProgresoEditado] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [nivelActivo, setNivelActivo] = useState("apropiada");
  const [busquedaHabilidad, setBusquedaHabilidad] = useState("");
  const [fecha, setFecha] = useState(obtenerFechaHoy());
  const [notaSesion, setNotaSesion] = useState("");

  useEffect(() => {
    if (!atleta) return;

    setCargando(true);

    Promise.all([
      fetch(`${API}/habilidades`, { cache: "no-store" }).then((res) => res.json()),
      fetch(`${API}/progresoHabilidades`, { cache: "no-store" }).then((res) => res.json()),
    ])
      .then(([datosHabilidades, datosProgreso]) => {
        // Se comparan como texto para que "1" y 1 cuenten como el mismo atleta
        const progresoDelAtleta = Array.isArray(datosProgreso)
          ? datosProgreso.filter((p) => String(p.atletaId) === String(atleta.id))
          : [];

        setHabilidades(Array.isArray(datosHabilidades) ? datosHabilidades : []);
        setProgresoOriginal(progresoDelAtleta);
        setProgresoEditado(progresoDelAtleta);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        setHabilidades([]);
        setProgresoOriginal([]);
        setProgresoEditado([]);
      })
      .finally(() => setCargando(false));
  }, [atleta]);

  // Cada habilidad con su estado actual (completado o no)
  const habilidadesDelAtleta = useMemo(() => {
    return habilidades.map((h) => {
      const registro = progresoEditado.find((p) => p.habilidadId === h.id);
      return {
        ...h,
        completado: registro ? registro.completado : false,
      };
    });
  }, [habilidades, progresoEditado]);

  const habilidadesFiltradas = useMemo(() => {
    return habilidadesDelAtleta
      .filter((h) => h.categoria === nivelActivo)
      .filter((h) => h.texto.toLowerCase().includes(busquedaHabilidad.toLowerCase().trim()));
  }, [habilidadesDelAtleta, nivelActivo, busquedaHabilidad]);

  const conteoPorCategoria = useMemo(() => {
    const contar = (categoria) => {
      const delGrupo = habilidadesDelAtleta.filter((h) => h.categoria === categoria);
      const completadas = delGrupo.filter((h) => h.completado).length;
      return { completadas, total: delGrupo.length };
    };
    return {
      apropiada: contar("apropiada"),
      avanzada: contar("avanzada"),
      elite: contar("elite"),
    };
  }, [habilidadesDelAtleta]);

  const puntaje = useMemo(() => {
    if (habilidadesDelAtleta.length === 0) return 0;
    const completadas = habilidadesDelAtleta.filter((h) => h.completado).length;
    return Math.round((completadas / habilidadesDelAtleta.length) * 100);
  }, [habilidadesDelAtleta]);

  // Registros que cambiaron respecto a lo que hay en el servidor.
  // - Si ya existía: cambió si el valor es distinto.
  // - Si es nuevo: solo cuenta si quedó en "Completado" (false es el valor por defecto).
  const cambios = useMemo(() => {
    return progresoEditado.filter((editado) => {
      const original = progresoOriginal.find((o) => o.id === editado.id);
      return original ? original.completado !== editado.completado : editado.completado;
    });
  }, [progresoEditado, progresoOriginal]);

  // Marca una habilidad por su id. Si todavía no tiene registro de progreso, lo crea.
  const marcarHabilidad = (habilidadId, nuevoValor) => {
    setProgresoEditado((prev) => {
      const existe = prev.some((p) => p.habilidadId === habilidadId);

      if (existe) {
        return prev.map((p) =>
          p.habilidadId === habilidadId ? { ...p, completado: nuevoValor } : p
        );
      }

      return [
        ...prev,
        {
          id: `${atleta.id}-${habilidadId}`,
          atletaId: String(atleta.id),
          habilidadId,
          completado: nuevoValor,
        },
      ];
    });
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const peticiones = cambios.map((registro) => {
        const existe = progresoOriginal.some((o) => o.id === registro.id);

        return existe
          ? fetch(`${API}/progresoHabilidades/${registro.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ completado: registro.completado }),
            })
          : fetch(`${API}/progresoHabilidades`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(registro),
            });
      });

      if (notaSesion.trim() !== "") {
        peticiones.push(
          fetch(`${API}/notas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: `n-${Date.now()}`,
              atletaId: String(atleta.id),
              fecha,
              autor: "Entrenador",
              texto: notaSesion.trim(),
            }),
          })
        );
      }

      const respuestas = await Promise.all(peticiones);

      // fetch no lanza error con respuestas 4xx/5xx, así que se revisan
      if (respuestas.some((r) => !r.ok)) {
        throw new Error("El servidor rechazó algunos cambios");
      }

      onVolver();
    } catch (error) {
      console.error("Error al guardar el registro:", error);
      alert("Hubo un error al guardar el registro. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    onVolver();
  };

  if (!atleta) return null;

  return (
    <main id="contenido-registrar" className="mt-3">
      <h3 id="titu-prin">Nuevo Registro de Rendimiento</h3>

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

      <section id="panel-prin">
        <div className="conte-prin">
          <h4 className="titu-conte">Datos de Registro</h4>

          <div id="targetas-ren">
            <div className="tar">
              <h5 id="ti-tar">ID rendimiento</h5>
              <span id="va-tar">{`RE${String(atleta.id).padStart(3, "0")}`}</span>
            </div>
            <div className="tar">
              <h5 id="ti-tar">ID usuario</h5>
              <span id="va-tar">{atleta.id}</span>
            </div>
          </div>

          <div id="detalle-linea"></div>

          <h4 className="titu-conte">Datos de la sesión</h4>
          <div className="conte-input">
            <div></div>
            <label className="titu-input" htmlFor="fecha">
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="conte-input">
            <label className="titu-input" htmlFor="nota-sesion">
              Notas de la sesión
            </label>
            <textarea
              className="cua-ren"
              id="nota-sesion"
              value={notaSesion}
              onChange={(e) => setNotaSesion(e.target.value)}
              placeholder="Ej. Reforzar la parada de manos"
            />
          </div>
          <div className="conte-input"></div>
        </div>

        <div className="conte-prin">
          <h4 className="titu-conte">Métricas de desempeño</h4>

          <div id="conte-circu">
            <button id="circulo" type="button">
              {puntaje}
              <br />
              Puntaje
            </button>
          </div>

          <div className="conte-barras">
            <div id="targe-superior">
              <span id="titu-barra">Apropiadas</span>
              <p>
                {conteoPorCategoria.apropiada.completadas}/{conteoPorCategoria.apropiada.total}
              </p>
            </div>
            <div className="barra-ren">
              <div
                className="barra-fill-ver"
                style={{
                  width: `${
                    conteoPorCategoria.apropiada.total > 0
                      ? (conteoPorCategoria.apropiada.completadas /
                          conteoPorCategoria.apropiada.total) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="conte-barras">
            <div id="targe-superior">
              <span id="titu-barra">Avanzadas</span>
              <p>
                {conteoPorCategoria.avanzada.completadas}/{conteoPorCategoria.avanzada.total}
              </p>
            </div>
            <div className="barra-ren">
              <div
                className="barra-fill-azul"
                style={{
                  width: `${
                    conteoPorCategoria.avanzada.total > 0
                      ? (conteoPorCategoria.avanzada.completadas /
                          conteoPorCategoria.avanzada.total) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="conte-barras">
            <div id="targe-superior">
              <span id="titu-barra">Élite</span>
              <p>
                {conteoPorCategoria.elite.completadas}/{conteoPorCategoria.elite.total}
              </p>
            </div>
            <div className="barra-ren">
              <div
                className="barra-fill"
                style={{
                  width: `${
                    conteoPorCategoria.elite.total > 0
                      ? (conteoPorCategoria.elite.completadas / conteoPorCategoria.elite.total) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <section id="btn-habilidades">
            {PESTANAS.map((pestana) => (
              <button
                key={pestana.key}
                type="button"
                id={
                  pestana.key === "apropiada"
                    ? "btn-a"
                    : pestana.key === "avanzada"
                    ? "btn-A"
                    : "btn-E"
                }
                className={`btn-pestana ${nivelActivo === pestana.key ? "activo" : ""}`}
                onClick={() => setNivelActivo(pestana.key)}
              >
                {pestana.icon}
                {pestana.label}
              </button>
            ))}
          </section>

          <input
            type="search"
            placeholder="Buscar Habilidad..."
            className="search-input"
            value={busquedaHabilidad}
            onChange={(e) => setBusquedaHabilidad(e.target.value)}
          />

          <section id="habilidades">
            {cargando ? (
              <p className="text-muted text-center py-4">Cargando habilidades...</p>
            ) : (
              <div className="grid-habi">
                {habilidadesFiltradas.length > 0 ? (
                  habilidadesFiltradas.map((h) => (
                    <div className="targe-habi" key={h.id}>
                      <div>
                        <span id="tex-habi">{h.texto}</span>
                      </div>
                      <div id="conte-btn-habi">
                        <button
                          type="button"
                          className={h.completado ? "btn-completado activo" : "btn-completado"}
                          onClick={() => marcarHabilidad(h.id, true)}
                        >
                          Completado
                        </button>
                        <button
                          type="button"
                          className={!h.completado ? "btn-completad activo" : "btn-completad"}
                          onClick={() => marcarHabilidad(h.id, false)}
                        >
                          No logrado
                        </button>
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

      <footer id="guardar-cam">
        <div id="conte-final">
          <span>Registro para {fecha}</span>
        </div>
        <div id="conte-final">
          <button type="button" id="cancelar" onClick={handleCancelar} disabled={guardando}>
            Cancelar
          </button>
          <button type="button" id="guardar" onClick={handleGuardar} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar registro"}
          </button>
        </div>
      </footer>
    </main>
  );
}

export default RegistrarRendimiento;