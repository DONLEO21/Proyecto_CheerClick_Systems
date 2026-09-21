import Header from "../../../components/Header/Header.jsx";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import menuAdmin from "../../../data/menuAdmin.js";
import { supabase } from "../../../services/supabase";
import useUsuario from "../../../hooks/useUsuario";
import { cargarUsuarios } from "../../../services/adminUsuarios";

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  SquarePen,
  Users,
  UserCheck,
  UserX,
  CalendarClock,
  PersonStanding,
  Trophy,
  Megaphone,
  Footprints,
  Shirt,
  MessageSquareDot,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';
import './DashboardAdmin.css';

// Ruta real de la pantalla de cuentas (App.jsx)
const RUTA_CUENTAS = '/admin/usuarios';

// Rutas de las pantallas externas//
const RUTA_HORARIOS = 'horarios.html';
const RUTA_NOVEDADES = 'novedades.html';

// Máximo de elementos visibles por tarjeta en el dashboard
const MAX_ITEMS = 3;

// --- Datos de ejemplo (pagos, actividades y novedades) ---//

// "cantidad" = número de cuentas en cada estado; los porcentajes se calculan solos
const PAGOS_STATS = [
  { id: 'pagado', nombre: 'Pagado', cantidad: 13, color: '#d71920' },
  { id: 'pendiente', nombre: 'Pendiente', cantidad: 5, color: '#c9c9c9' },
  { id: 'vencido', nombre: 'Vencido', cantidad: 3, color: '#4d4d4d' },
];

const ACTIVIDADES = [
  {
    id: 1,
    icono: PersonStanding,
    variante: 'amarillo',
    titulo: 'Competencia regional - UNIVERSAL',
    fecha: '25 de julio del 2026',
    fechaOrden: '2026-07-25', // AAAA-MM-DD (fecha de inicio)
  },
  {
    id: 2,
    icono: Trophy,
    variante: null,
    titulo: 'Competencia regional - INFINITY LEAGUE',
    fecha: '20 de septiembre del 2026',
    fechaOrden: '2026-09-20', // AAAA-MM-DD (fecha de inicio)
  },
  {
    id: 3,
    icono: Trophy,
    variante: 'alerta',
    titulo: 'Competencia nacional - CONTINENTAL',
    fecha: '25 - 27 de septiembre del 2026',
    fechaOrden: '2026-09-25', // AAAA-MM-DD (fecha de inicio)
  },
];

const NOVEDADES = [
  {
    id: 1,
    icono: Footprints,
    titulo: 'Clases de entrenamiento programadas',
    detalle: '27 de marzo del 2026 · 6:00 PM',
    fechaOrden: '2026-03-27', // AAAA-MM-DD
  },
  {
    id: 2,
    icono: Shirt,
    titulo: 'Nuevo implemento deportivo solicitado',
    detalle: '16 de mayo del 2026 · Camiseta deportiva',
    fechaOrden: '2026-05-16', // AAAA-MM-DD
  },
  {
    id: 3,
    icono: MessageSquareDot,
    titulo: 'Nueva PQRS registrada',
    detalle: 'Leonardo Jara · Atleta',
    fechaOrden: '2026-09-19', // AAAA-MM-DD
  },
];

// Campeonatos: el más cercano primero. Al conectar con Horarios, filtra también fechaOrden >= hoy.
const ACTIVIDADES_ORDENADAS = [...ACTIVIDADES].sort((a, b) => a.fechaOrden.localeCompare(b.fechaOrden));
// Novedades: la más reciente primero.
const NOVEDADES_ORDENADAS = [...NOVEDADES].sort((a, b) => b.fechaOrden.localeCompare(a.fechaOrden));

// Enlace a la pantalla completa. Siempre visible; el contador aparece solo si hay más de MAX_ITEMS.
function VerTodas({ total, onClick, etiqueta }) {
  return (
    <button type="button" className="enlace-ver-todas" onClick={onClick}>
      {etiqueta}
      {total > MAX_ITEMS ? ` (${total})` : ''}
      <ChevronRight size={16} strokeWidth={2.2} />
    </button>
  );
}

// nombreAdmin queda solo como respaldo si la cuenta no tiene nombre guardado
function DashboardAdmin({ nombreAdmin = 'Ronald Linares', onNavigate = () => {} }) {
  // nombre ingresado en el registro (user_metadata.nombre)
  const usuario = useUsuario();
  const nombreCompleto = usuario.nombre || (usuario.cargando ? '' : nombreAdmin);
  const primerNombre = nombreCompleto.split(' ')[0];

  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(0); // paginador de solicitudes (base 0)
  const [pagoActivo, setPagoActivo] = useState(null); // estado resaltado en la torta

  // cuentas reales (misma fuente que la pantalla de cuentas)
  const [cuentas, setCuentas] = useState([]);
  const [cargandoCuentas, setCargandoCuentas] = useState(true);
  const [errorCuentas, setErrorCuentas] = useState('');

  useEffect(() => {
    cargarUsuarios()
      .then(setCuentas)
      .catch((e) => setErrorCuentas(e.message))
      .finally(() => setCargandoCuentas(false));
  }, []);

  // Usuarios = cuentas ya aprobadas (activas o desactivadas)
  const stats = useMemo(() => {
    const aprobadas = cuentas.filter((c) => c.estado === 'aprobada');
    const activos = aprobadas.filter((c) => c.activo).length;
    return { total: aprobadas.length, activos, inactivos: aprobadas.length - activos };
  }, [cuentas]);

  // Todas las solicitudes pendientes (sin filtrar)
  const pendientes = useMemo(() => cuentas.filter((c) => c.estado === 'pendiente'), [cuentas]);

  // Pendientes filtradas por el buscador (busca en TODAS, no solo en las visibles)
  const solicitudesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return pendientes;
    return pendientes.filter((c) =>
      [c.codigo, c.nombre, c.email, c.rol].some((campo) =>
        (campo ?? '').toLowerCase().includes(termino)
      )
    );
  }, [pendientes, busqueda]);

  // Paginación: máximo MAX_ITEMS filas por página
  const totalPaginas = Math.max(1, Math.ceil(solicitudesFiltradas.length / MAX_ITEMS));
  const paginaActual = Math.min(pagina, totalPaginas - 1);
  const inicio = paginaActual * MAX_ITEMS;
  const solicitudesVisibles = solicitudesFiltradas.slice(inicio, inicio + MAX_ITEMS);

  const valorStat = (n) => (cargandoCuentas || errorCuentas ? '—' : n);

  // Datos del donut
  const totalPagos = PAGOS_STATS.reduce((suma, p) => suma + p.cantidad, 0);
  const porcentaje = (n) => (totalPagos ? Math.round((n * 100) / totalPagos) : 0);
  const pagoResaltado = PAGOS_STATS.find((p) => p.id === pagoActivo);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = '/acceso';
  };

  const irAInicio = () => {
    window.location.href = '/';
  };

  // Navega a la pantalla de cuentas. Con un id, esa pantalla abre el modal de esa solicitud.
  const irACuentas = (id) => {
    window.location.href = id ? `${RUTA_CUENTAS}?ver=${id}` : RUTA_CUENTAS;
  };

  return (
    <div className="dashboard">
      <Sidebar
        items={menuAdmin}
        activeHref="/admin"
        onNavigate={(href) => (window.location.href = href)}
      />

      <div className="dashboard__contenido">
        <Header rol="Administrador" onCerrarSesion={cerrarSesion} onIrInicio={irAInicio} />

        <main className="admin-main">
          <div className="contenedor">

            {/* encabezado principal */}
            <section className="bienvenida-admin" aria-labelledby="titulo-dashboard">
              <div className="bienvenida-admin__texto">
                <h1 id="titulo-dashboard">Hola, {primerNombre} 👋</h1>
              </div>

              <a
                href="perfil-admin.html"
                className="btn btn-primario bienvenida-admin__perfil"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('perfil-admin.html');
                }}
              >
                <SquarePen size={24} strokeWidth={2} />
                Perfil
              </a>
            </section>

            {/* tarjetas principales */}
            <section className="panel-resumen-admin" aria-label="resumen del administrador">

              {/* fila 1: usuarios */}
              <article className="tarjeta-dashboard tarjeta-dashboard--atletas">
                <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
                  <span className="icono-cabecera">
                    <Users size={22} strokeWidth={2} />
                  </span>
                  <h2>Usuarios</h2>
                </header>

                <div className="tarjeta-dashboard__contenido lista-usuarios-stats">
                  <div className="stat-usuarios stat-usuarios--total">
                    <span className="stat-usuarios__icono">
                      <Users size={20} strokeWidth={2} />
                    </span>
                    <div className="stat-usuarios__texto">
                      <span className="stat-usuarios__numero">{valorStat(stats.total)}</span>
                      <span className="stat-usuarios__etiqueta">Usuarios totales</span>
                    </div>
                  </div>

                  <div className="stat-usuarios stat-usuarios--activos">
                    <span className="stat-usuarios__icono">
                      <UserCheck size={20} strokeWidth={2} />
                    </span>
                    <div className="stat-usuarios__texto">
                      <span className="stat-usuarios__numero">{valorStat(stats.activos)}</span>
                      <span className="stat-usuarios__etiqueta">Usuarios activos</span>
                    </div>
                  </div>

                  <div className="stat-usuarios stat-usuarios--inactivos">
                    <span className="stat-usuarios__icono">
                      <UserX size={20} strokeWidth={2} />
                    </span>
                    <div className="stat-usuarios__texto">
                      <span className="stat-usuarios__numero">{valorStat(stats.inactivos)}</span>
                      <span className="stat-usuarios__etiqueta">Usuarios inactivos</span>
                    </div>
                  </div>
                </div>

                <a
                  href={RUTA_CUENTAS}
                  className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--ancho"
                  onClick={(e) => {
                    e.preventDefault();
                    irACuentas();
                  }}
                >
                  Gestionar cuentas
                </a>
              </article>

              {/* fila 1: resumen de pagos */}
              <article className="tarjeta-dashboard tarjeta-dashboard--pagos">
                <header className="tarjeta-dashboard__header">
                  <h2>Resumen de pagos mensualidades</h2>
                </header>

                <div className="tarjeta-dashboard__contenido contenido-estadisticas">
                  <ul className="leyenda-estados" aria-label="leyenda del estado de cuentas">
                    {PAGOS_STATS.map((p) => (
                      <li
                        key={p.id}
                        className={pagoActivo === p.id ? 'activo' : ''}
                        style={{ '--color-estado': p.color }}
                        tabIndex={0}
                        onMouseEnter={() => setPagoActivo(p.id)}
                        onMouseLeave={() => setPagoActivo(null)}
                        onFocus={() => setPagoActivo(p.id)}
                        onBlur={() => setPagoActivo(null)}
                      >
                        <span className="punto" style={{ backgroundColor: p.color }}></span>
                        <span className="leyenda-estados__nombre">{p.nombre}</span>
                        <span className="leyenda-estados__valor">{porcentaje(p.cantidad)}%</span>
                      </li>
                    ))}
                  </ul>

                  <div className="grafico-estados">
                    <PieChart width={190} height={190}>
                      <Pie
                        data={PAGOS_STATS}
                        dataKey="cantidad"
                        nameKey="nombre"
                        innerRadius={54}
                        outerRadius={90}
                        paddingAngle={2}
                        stroke="none"
                        onMouseEnter={(_, i) => setPagoActivo(PAGOS_STATS[i].id)}
                        onMouseLeave={() => setPagoActivo(null)}
                      >
                        {PAGOS_STATS.map((entrada) => (
                          <Cell
                            key={entrada.id}
                            fill={entrada.color}
                            fillOpacity={pagoActivo && pagoActivo !== entrada.id ? 0.3 : 1}
                            className={
                              'segmento-torta' +
                              (pagoActivo === entrada.id ? ' segmento-torta--activo' : '')
                            }
                          />
                        ))}
                      </Pie>
                    </PieChart>

                    {/* texto al centro: total de cuentas, o el % del estado resaltado */}
                    <div className="grafico-estados__centro">
                      <strong>{pagoResaltado ? `${porcentaje(pagoResaltado.cantidad)}%` : totalPagos}</strong>
                      <span>{pagoResaltado ? pagoResaltado.nombre : 'Cuentas'}</span>
                    </div>
                  </div>
                </div>

                <a
                  href="Gestion_Pagos_admi.html"
                  className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--centrado"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('Gestion_Pagos_admi.html');
                  }}
                >
                  Ver registro completo
                </a>
              </article>

              {/* fila 1: próximas actividades */}
              <article className="tarjeta-dashboard">
                <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
                  <span className="icono-cabecera">
                    <CalendarClock size={22} strokeWidth={2} />
                  </span>
                  <h2>Próximas actividades</h2>
                </header>

                <div className="tarjeta-dashboard__contenido">
                  <ul className="lista-actividades">
                    {ACTIVIDADES_ORDENADAS.slice(0, MAX_ITEMS).map(({ id, icono: Icono, variante, titulo, fecha }) => (
                      <li className="lista-actividades__item" key={id}>
                        <a
                          href={RUTA_HORARIOS}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(RUTA_HORARIOS);
                          }}
                        >
                          <div
                            className={
                              'lista-actividades__icono' +
                              (variante ? ` lista-actividades__icono--${variante}` : '')
                            }
                          >
                            <Icono size={24} strokeWidth={2} />
                          </div>
                          <div className="lista-actividades__texto">
                            <h3>{titulo}</h3>
                            <p>{fecha}</p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <VerTodas
                  total={ACTIVIDADES.length}
                  etiqueta="Ver todos los campeonatos"
                  onClick={() => onNavigate(RUTA_HORARIOS)}
                />
              </article>

              {/* fila 2: solicitudes pendientes */}
              <article className="tarjeta-dashboard tarjeta-dashboard--ancha">
                <header className="tarjeta-dashboard__header tarjeta-dashboard__header--espacio">
                  <div className="titulo-con-contador">
                    <h2>Solicitudes de cuentas pendientes</h2>
                    {!cargandoCuentas && !errorCuentas && pendientes.length > 0 && (
                      <span
                        className="contador-pendientes"
                        aria-label={`${pendientes.length} solicitudes pendientes`}
                      >
                        {pendientes.length}
                      </span>
                    )}
                  </div>

                  <label className="buscador" aria-label="buscar solicitudes">
                    <Search size={18} strokeWidth={2} />
                    <input
                      type="search"
                      placeholder="Buscar"
                      value={busqueda}
                      onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPagina(0);
                      }}
                    />
                  </label>
                </header>

                <div className="tarjeta-dashboard__contenido">
                  <div className="tabla-dashboard__scroll">
                    <table className="tabla-dashboard">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Rol</th>
                          <th>Correo</th>
                          <th>Fecha registro</th>
                          <th>Acción</th>
                        </tr>
                      </thead>

                      <tbody>
                        {solicitudesVisibles.map((c) => (
                          <tr key={c.id}>
                            <td>{c.codigo}</td>
                            <td>{c.nombre}</td>
                            <td>
                              <span className={`badge badge--${c.rol === 'entrenador' ? 'amarillo' : 'azul'}`}>
                                {c.rol === 'entrenador' ? 'Entrenador' : 'Atleta'}
                              </span>
                            </td>
                            <td>{c.email}</td>
                            <td>{new Date(c.created_at).toLocaleDateString('es-CO')}</td>
                            <td>
                              <button type="button" className="btn-tabla btn-tabla--ver" onClick={() => irACuentas(c.id)}>
                                <Search size={18} strokeWidth={2} />
                                Ver
                              </button>
                            </td>
                          </tr>
                        ))}

                        {cargandoCuentas && (
                          <tr>
                            <td colSpan={6} className="tabla-dashboard__vacio">
                              Cargando solicitudes...
                            </td>
                          </tr>
                        )}

                        {!cargandoCuentas && errorCuentas && (
                          <tr>
                            <td colSpan={6} className="tabla-dashboard__vacio">
                              No se pudieron cargar las solicitudes: {errorCuentas}
                            </td>
                          </tr>
                        )}

                        {!cargandoCuentas && !errorCuentas && solicitudesFiltradas.length === 0 && (
                          <tr>
                            <td colSpan={6} className="tabla-dashboard__vacio">
                              {busqueda.trim()
                                ? 'Ninguna solicitud coincide con tu búsqueda.'
                                : 'No hay solicitudes pendientes.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* pie: solo aparece si hay más de 3 solicitudes */}
                {!cargandoCuentas && !errorCuentas && solicitudesFiltradas.length > MAX_ITEMS && (
                  <footer className="pie-tabla">
                    <span>
                      Mostrando {inicio + 1}–{inicio + solicitudesVisibles.length} de{' '}
                      {solicitudesFiltradas.length}
                    </span>

                    <div className="pie-tabla__acciones">
                      <button
                        type="button"
                        className="enlace-ver-todas"
                        onClick={() => irACuentas()}
                      >
                        Ver todas en Cuentas
                      </button>

                      <div className="paginador" role="group" aria-label="paginación de solicitudes">
                        <button
                          type="button"
                          aria-label="Página anterior"
                          disabled={paginaActual === 0}
                          onClick={() => setPagina(paginaActual - 1)}
                        >
                          <ChevronLeft size={18} strokeWidth={2.2} />
                        </button>
                        <span className="paginador__indicador">
                          {paginaActual + 1} / {totalPaginas}
                        </span>
                        <button
                          type="button"
                          aria-label="Página siguiente"
                          disabled={paginaActual >= totalPaginas - 1}
                          onClick={() => setPagina(paginaActual + 1)}
                        >
                          <ChevronRight size={18} strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>
                  </footer>
                )}
              </article>

              {/* fila 2: novedades */}
              <article className="tarjeta-dashboard">
                <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
                  <span className="icono-cabecera">
                    <Megaphone size={22} strokeWidth={2} />
                  </span>
                  <h2>Novedades</h2>
                </header>

                <div className="tarjeta-dashboard__contenido">
                  <ul className="lista-novedades">
                    {NOVEDADES_ORDENADAS.slice(0, MAX_ITEMS).map(({ id, icono: Icono, titulo, detalle }) => (
                      <li className="lista-novedades__item" key={id}>
                        <a
                          href={RUTA_NOVEDADES}
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(RUTA_NOVEDADES);
                          }}
                        >
                          <div className="lista-novedades__icono">
                            <Icono size={24} strokeWidth={2} />
                          </div>
                          <div className="lista-novedades__texto">
                            <h3>{titulo}</h3>
                            <p>{detalle}</p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <VerTodas
                  total={NOVEDADES.length}
                  etiqueta="Ver todas las novedades"
                  onClick={() => onNavigate(RUTA_NOVEDADES)}
                />
              </article>

            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardAdmin;