import { useEffect, useMemo, useState } from 'react';
import Header from "../../../components/Header/Header.jsx";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import AvisoToast from "../../../components/AvisoToast";
import menuAtleta from "../../../data/menuAtleta.js";
import { supabase } from "../../../services/supabase";
import useUsuario from "../../../hooks/useUsuario";
import useAviso from "../../../hooks/useAviso";

import {
  SquarePen, TrendingUp, Calendar, ChevronLeft, ChevronRight,
  MessageCircle, MapPin, Wallet,
} from 'lucide-react';

import './DashboardAtleta.css';
import fotoPerfil from "../../../assets/img/tik-tok.png";

/* ───────── configuración ───────── */
// AJUSTA nombres de tablas/columnas a tu BD real
const DB = {
  usuarios: 'usuarios',
  niveles: 'niveles',
  entrenamientos: 'entrenamientos',
  asistencias: 'asistencias',       
  evaluaciones: 'evaluaciones',      
  habilidades: 'habilidades_atleta', 
  pagos: 'mensualidades',            
  torneos: 'torneos',                
  inscripciones: 'inscripciones',    
  pqrs: 'pqrs',                      
};

const RUTAS = {
  perfil: '/atleta/perfil',
  rendimiento: '/atleta/rendimiento',
  entrenamientos: '/atleta/entrenamientos',
  pqrs: '/atleta/pqrs',
  mensualidades: '/atleta/mensualidades',
  torneo: (id) => `/atleta/torneos/${id}`,
};

const RUTA_INICIO_ATLETA = '/atleta';
const USAR_DATOS_DEMO = false;      // true = siempre datos quemados
const DEMO_SI_FALLA = true;         // true = si no hay datos/BD, usa quemados
const TORNEOS_POR_PAGINA = 4;

const CATEGORIAS = [
  { id: 'baile', nombre: 'Baile', color: 'morado' },
  { id: 'gimnasia', nombre: 'Gimnasia', color: 'amarillo' },
  { id: 'partner', nombre: 'Partner', color: 'azul' },
];

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MESES_CORTO = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const DIAS = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];

/* ───────── utilidades ───────── */
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hace = (dias) => { const d = new Date(); d.setDate(d.getDate() - dias); return d; };
const dia10 = (f) => String(f).slice(0, 10);
const fechaLocal = (f) => new Date(`${dia10(f)}T00:00:00`);
const prom = (arr) => (arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : null);
const hora12 = (h) => {
  if (!h) return '';
  const [H, M] = String(h).split(':').map(Number);
  return `${H % 12 || 12}:${pad(M)} ${H >= 12 ? 'PM' : 'AM'}`;
};
const moneda = (v) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v);
const fechaCorta = (f) => { const d = fechaLocal(f); return `${d.getDate()} ${MESES_CORTO[d.getMonth()]} ${d.getFullYear()}`; };
const mayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ───────── acceso a datos ───────── */
async function pedir(tabla, armar) {
  const { data, error } = await armar(supabase.from(tabla));
  if (error) throw new Error(`${tabla}: ${error.message}`);
  return data ?? [];
}

async function cargarBase(uid) {
  const errores = [];
  const seguro = async (tabla, armar) => {
    try { return await pedir(tabla, armar); } catch (e) { errores.push(e.message); return []; }
  };

  const [yo] = await seguro(DB.usuarios, (t) => t.select('id,nombre,id_nivel,foto').eq('id', uid).limit(1));
  if (!yo) return { yo: null, errores };

  const [nivel, asist, evals, habilidades, pagos, torneos, inscr, pqrs] = await Promise.all([
    yo.id_nivel
      ? seguro(DB.niveles, (t) => t.select('id,nombre').eq('id', yo.id_nivel).limit(1))
      : Promise.resolve([]),
    seguro(DB.asistencias, (t) => t.select('fecha,presente').eq('id_atleta', uid)),
    seguro(DB.evaluaciones, (t) => t.select('fecha,baile,gimnasia,partner').eq('id_atleta', uid).gte('fecha', iso(hace(27)))),
    seguro(DB.habilidades, (t) => t.select('estado').eq('id_atleta', uid)),
    seguro(DB.pagos, (t) => t.select('fecha_pago,valor,mes,estado,fecha_vencimiento').eq('id_atleta', uid).order('fecha_vencimiento', { ascending: false }).limit(12)),
    seguro(DB.torneos, (t) => t.select('id,nombre,fecha,lugar').gte('fecha', iso(new Date())).order('fecha')),
    seguro(DB.inscripciones, (t) => t.select('id_torneo').eq('id_atleta', uid)),
    seguro(DB.pqrs, (t) => t.select('estado').eq('id_usuario', uid)),
  ]);

  return {
    yo, nivel: nivel[0] ?? null, asist, evals, habilidades, pagos,
    torneos, inscritos: inscr.map((i) => String(i.id_torneo)), pqrs, errores,
  };
}

async function cargarEntrenos(idNivel, desde, hasta) {
  if (!idNivel) return [];
  return pedir(DB.entrenamientos, (t) =>
    t.select('id,id_nivel,titulo,fecha,hora_inicio,hora_fin')
      .eq('id_nivel', idNivel).gte('fecha', desde).lte('fecha', hasta)
      .order('fecha').order('hora_inicio'));
}

/* ───────── datos quemados ───────── */
const DEMO_BASE = (() => {
  const estados = ['aprobado','aprobado','aprobado','reprobado','aprobado','aprobado','aprobado','reprobado','aprobado','reprobado','reprobado','aprobado'];
  const evals = [62, 68, 74, 80].map((b, w) => ({
    fecha: iso(hace(3 + 7 * (3 - w))), baile: b + 8, gimnasia: b + 12, partner: b - 6,
  }));
  const asist = Array.from({ length: 60 }, (_, i) => ({ fecha: iso(hace(i)), presente: i % 5 !== 0 }));
  const y = new Date().getFullYear();
  return {
    yo: { id: 'demo', nombre: 'Gabriela Deaquiz', id_nivel: 1, foto: null },
    nivel: { id: 1, nombre: 'Nivel 3 Magic' },
    asist, evals,
    habilidades: estados.map((estado) => ({ estado })),
    pagos: [
      { mes: 'Agosto', valor: 120000, estado: 'pagado', fecha_pago: iso(hace(20)), fecha_vencimiento: iso(hace(15)) },
      { mes: 'Septiembre', valor: 120000, estado: 'pendiente', fecha_pago: null, fecha_vencimiento: iso(new Date(Date.now() + 8 * 864e5)) },
    ],
    torneos: [
      { id: 'universal', nombre: 'Torneo Universal', fecha: `${y}-10-25`, lugar: 'Bogotá - Colegio San Viator' },
      { id: 'nfinity', nombre: 'Torneo Nfinity League', fecha: `${y}-11-20`, lugar: 'Bogotá - City Hall' },
      { id: 'summer', nombre: 'Torneo Summer', fecha: `${y}-12-10`, lugar: 'Tocaima - Parque acuático' },
      { id: 'xiua', nombre: 'Torneo Xiua', fecha: `${y + 1}-01-29`, lugar: 'Sibaté - Coliseo' },
      { id: 'allcheer', nombre: 'ALLCHEER Nacional', fecha: `${y + 1}-03-14`, lugar: 'Medellín - Atanasio' },
      { id: 'copa', nombre: 'Copa Colombia', fecha: `${y + 1}-04-18`, lugar: 'Cali - Coliseo El Pueblo' },
    ],
    inscritos: ['universal'],
    pqrs: [{ estado: 'respondida' }, { estado: 'respondida' }, { estado: 'proceso' }, { estado: 'pendiente' }],
    errores: [],
  };
})();

const TIPOS_ENTRENO = ['Baile', 'Gimnasia', 'Partner'];
function demoEntrenos(desde, hasta) {
  const out = [];
  const fin = new Date(`${hasta}T00:00:00`);
  for (let d = new Date(`${desde}T00:00:00`); d <= fin; d.setDate(d.getDate() + 1)) {
    if (![2, 4, 6].includes(d.getDay())) continue;
    const n = d.getDate();
    const s = [{ t: TIPOS_ENTRENO[n % 3], i: '16:00:00', f: '17:30:00' }];
    if (n % 4 === 0) s.push({ t: TIPOS_ENTRENO[(n + 1) % 3], i: '17:30:00', f: '19:00:00' });
    s.forEach((x, k) => out.push({
      id: `${iso(d)}-${k}`, id_nivel: 1, titulo: x.t, fecha: iso(d), hora_inicio: x.i, hora_fin: x.f,
    }));
  }
  return out;
}

/* ───────── subcomponentes ───────── */
function GraficaHabilidades({ habilidades }) {
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

/* ───────── pantalla ───────── */
export default function DashboardAtleta({
  nombreAtleta = 'Atleta',
  onNavigate = (href) => { window.location.href = href; },
}) {
  const usuario = useUsuario();
  const nombreCompleto = usuario.nombre || (usuario.cargando ? '' : nombreAtleta);
  const primerNombre = nombreCompleto.split(' ')[0];
  const { aviso, mostrarAviso } = useAviso();
  const hoy = iso(new Date());

  /* datos base */
  const [base, setBase] = useState(DEMO_BASE);
  const [cargando, setCargando] = useState(true);
  const [demo, setDemo] = useState(USAR_DATOS_DEMO);

  useEffect(() => {
    let vivo = true;
    const usarDemo = () => { setBase(DEMO_BASE); setDemo(true); };
    const cargar = async () => {
      if (USAR_DATOS_DEMO) return DEMO_BASE;
      const { data } = await supabase.auth.getUser();
      const uid = data?.user?.id;
      if (!uid) throw new Error('No hay una sesión activa.');
      return cargarBase(uid);
    };
    cargar()
      .then((b) => {
        if (!vivo) return;
        if (DEMO_SI_FALLA && !b.yo) {
          if (b.errores?.length) console.warn('Dashboard atleta (datos de ejemplo):', b.errores);
          return usarDemo();
        }
        setBase(b);
        if (b.errores.length) mostrarAviso(`No se pudo leer: ${b.errores[0]}`, 'error');
      })
      .catch((e) => {
        if (!vivo) return;
        mostrarAviso(e.message, 'error');
        if (DEMO_SI_FALLA) usarDemo();
      })
      .finally(() => vivo && setCargando(false));
    return () => { vivo = false; };
  }, []);

  const idNivel = base.yo?.id_nivel ?? null;

  /* ── calendario ── */
  const [mes, setMes] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [entrenos, setEntrenos] = useState([]);
  const [proximo, setProximo] = useState(null);
  const [cargandoCal, setCargandoCal] = useState(false);
  const [diaSel, setDiaSel] = useState(hoy);

  const obtenerEntrenos = (desde, hasta) =>
    demo ? Promise.resolve(demoEntrenos(desde, hasta)) : cargarEntrenos(idNivel, desde, hasta);

  const mesClave = `${mes.getFullYear()}-${mes.getMonth()}`;

  useEffect(() => {
    if (cargando) return;
    let vivo = true;
    setCargandoCal(true);
    obtenerEntrenos(iso(mes), iso(new Date(mes.getFullYear(), mes.getMonth() + 1, 0)))
      .then((r) => vivo && setEntrenos(r))
      .catch((e) => { if (vivo) { setEntrenos([]); mostrarAviso(e.message, 'error'); } })
      .finally(() => vivo && setCargandoCal(false));
    return () => { vivo = false; };
  }, [mesClave, cargando, idNivel, demo]);

  // próximo entrenamiento (siguientes 30 días)
  useEffect(() => {
    if (cargando) return;
    let vivo = true;
    const fin = new Date(); fin.setDate(fin.getDate() + 30);
    obtenerEntrenos(hoy, iso(fin))
      .then((r) => {
        if (!vivo) return;
        const ahora = new Date();
        const sig = r.find((e) => new Date(`${dia10(e.fecha)}T${e.hora_inicio || '23:59:00'}`) >= ahora);
        setProximo(sig ?? null);
      })
      .catch(() => vivo && setProximo(null));
    return () => { vivo = false; };
  }, [cargando, idNivel, demo]);

  const porDia = useMemo(() => {
    const m = {};
    entrenos.forEach((e) => { const f = dia10(e.fecha); (m[f] ||= []).push(e); });
    return m;
  }, [entrenos]);

  const asistPorDia = useMemo(() => {
    const m = {};
    base.asist.forEach((a) => { m[dia10(a.fecha)] = !!a.presente; });
    return m;
  }, [base.asist]);

  const primerDiaSemana = new Date(mes.getFullYear(), mes.getMonth(), 1).getDay();
  const diasDelMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const prefijoMes = `${mes.getFullYear()}-${pad(mes.getMonth() + 1)}`;
  const cambiarMes = (delta) => setMes(new Date(mes.getFullYear(), mes.getMonth() + delta, 1));
  const delDia = diaSel.startsWith(prefijoMes) ? porDia[diaSel] ?? [] : null;
  const fechaLarga = mayus(fechaLocal(diaSel).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }));

  /* ── métricas ── */
  const metricas = useMemo(() => {
    const porCat = CATEGORIAS.map((c) => {
      const v = base.evals.map((e) => Number(e[c.id])).filter(Number.isFinite);
      return { ...c, valor: v.length ? Math.round(prom(v)) : null };
    });
    const semana = (i) => {
      const desde = iso(hace(7 * (i + 1) - 1)), hasta = iso(hace(7 * i));
      const v = base.evals
        .filter((e) => dia10(e.fecha) >= desde && dia10(e.fecha) <= hasta)
        .flatMap((e) => CATEGORIAS.map((c) => Number(e[c.id])).filter(Number.isFinite));
      return prom(v);
    };
    const [actual, previa] = [semana(0), semana(1)];
    const variacion = actual !== null && previa ? Math.round(((actual - previa) / previa) * 100) : null;
    const entrenamientos = base.asist.filter((a) => a.presente).length;
    return { porCat, variacion, entrenamientos };
  }, [base.evals, base.asist]);

  /* ── PQRS ── */
  const pqrsResumen = useMemo(() => {
    const c = (e) => base.pqrs.filter((p) => p.estado === e).length;
    return [
      { id: 'respondida', texto: `${c('respondida')} resuelta${c('respondida') === 1 ? '' : 's'}` },
      { id: 'proceso', texto: `${c('proceso')} en trámite` },
      { id: 'pendiente', texto: `${c('pendiente')} pendiente${c('pendiente') === 1 ? '' : 's'}` },
    ];
  }, [base.pqrs]);

  /* ── mensualidades ── */
  const pagos = useMemo(() => {
    const pagados = base.pagos.filter((p) => p.estado === 'pagado' && p.fecha_pago)
      .sort((a, b) => dia10(b.fecha_pago).localeCompare(dia10(a.fecha_pago)));
    const pendientes = base.pagos.filter((p) => p.estado !== 'pagado')
      .sort((a, b) => dia10(a.fecha_vencimiento).localeCompare(dia10(b.fecha_vencimiento)));
    const ultimo = pagados[0] ?? null;
    const siguiente = pendientes[0] ?? null;
    let estado = 'aldia';
    if (siguiente) estado = dia10(siguiente.fecha_vencimiento) < hoy ? 'mora' : 'pendiente';
    const dias = siguiente
      ? Math.round((fechaLocal(siguiente.fecha_vencimiento) - fechaLocal(hoy)) / 864e5)
      : null;
    return { ultimo, siguiente, estado, dias };
  }, [base.pagos, hoy]);

  /* ── torneos (paginados) ── */
  const [pagTorneo, setPagTorneo] = useState(1);
  const totalPagTorneo = Math.max(1, Math.ceil(base.torneos.length / TORNEOS_POR_PAGINA));
  const torneosVisibles = base.torneos.slice((pagTorneo - 1) * TORNEOS_POR_PAGINA, pagTorneo * TORNEOS_POR_PAGINA);

  /* ── sesión ── */
  const cerrarSesion = async () => { await supabase.auth.signOut(); window.location.href = '/acceso'; };
  const irAInicio = () => { window.location.href = '/'; };

  const foto = base.yo?.foto || fotoPerfil;
  const nombreNivel = base.nivel?.nombre ?? 'Sin nivel';
  const prox = proximo
    ? {
        fecha: `${mayus(fechaLocal(proximo.fecha).toLocaleDateString('es-CO', { weekday: 'short' }).replace('.', ''))} ${fechaLocal(proximo.fecha).getDate()} · ${hora12(proximo.hora_inicio)}`,
        tipo: proximo.titulo || 'Entrenamiento',
      }
    : null;

  return (
    <div className="dashboard">
      <Sidebar items={menuAtleta} activeHref={RUTA_INICIO_ATLETA}
        onNavigate={(href) => (window.location.href = href)} />

      <div className="dashboard__contenido">
        <Header rol="Atleta" onCerrarSesion={cerrarSesion} onIrInicio={irAInicio} />

        <main className="panel-atleta">
          <div className="contenedor">

            {/* encabezado */}
            <section className="bienvenida-atleta" aria-labelledby="titulo-dashboard">
              <h1 id="titulo-dashboard">Hola, {primerNombre} 👋</h1>
              <button type="button" className="btn btn-primario" onClick={() => onNavigate(RUTAS.perfil)}>
                <SquarePen size={24} strokeWidth={2} /> Perfil
              </button>
            </section>

            <section className="panel-resumen-atleta" aria-label="resumen del atleta">

              {/* rendimiento */}
              <article className="tarjeta-dashboard tarjeta-rendimiento">
                <header className="tarjeta-dashboard__header"><h2>Tu rendimiento</h2></header>
                <div className="tarjeta-dashboard__contenido tarjeta-rendimiento__contenido">
                  <figure className="grafico-rendimiento">
                    <GraficaHabilidades habilidades={base.habilidades} />
                  </figure>
                  <p className="tarjeta-progreso__variacion">
                    {metricas.variacion === null ? (
                      <span>Sin datos para comparar</span>
                    ) : (
                      <>
                        <TrendingUp size={18} strokeWidth={2} className={metricas.variacion < 0 ? 'icono-invertido' : ''} />
                        <strong className={metricas.variacion < 0 ? 'variacion--baja' : ''}>
                          {metricas.variacion >= 0 ? '+' : ''}{metricas.variacion}%
                        </strong>{' '}
                        respecto a la semana pasada
                      </>
                    )}
                  </p>
                  <button type="button" className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--completo"
                    onClick={() => onNavigate(RUTAS.rendimiento)}>
                    Ver mi Rendimiento
                  </button>
                </div>
              </article>

              {/* progreso semanal */}
              <article className="tarjeta-dashboard tarjeta-progreso">
                <header className="tarjeta-dashboard__header"><h2>Progreso semanal</h2></header>
                <div className="tarjeta-dashboard__contenido">
                  <div className="lista-progreso">
                    {metricas.porCat.map(({ id, nombre, valor, color }) => (
                      <div className="barra-progreso" key={id}>
                        <div className="barra-progreso__etiqueta">
                          <span>{nombre}</span><span>{valor === null ? '—' : `${valor}%`}</span>
                        </div>
                        <div className="barra-progreso__pista">
                          <div className={`barra-progreso__relleno barra-progreso__relleno--${color}`}
                            style={{ width: `${valor ?? 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              {/* calendario */}
              <article className="tarjeta-dashboard tarjeta-calendario">
                <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
                  <Calendar size={24} strokeWidth={2} /><h2>Calendario</h2>
                </header>

                <div className="tarjeta-dashboard__contenido">
                  <div className="calendario__cabecera">
                    <button type="button" className="calendario__flecha" aria-label="Mes anterior" onClick={() => cambiarMes(-1)}>
                      <ChevronLeft size={16} strokeWidth={2} />
                    </button>
                    <span className="calendario__mes-actual">{MESES[mes.getMonth()]}, {mes.getFullYear()}</span>
                    <button type="button" className="calendario__flecha" aria-label="Mes siguiente" onClick={() => cambiarMes(1)}>
                      <ChevronRight size={16} strokeWidth={2} />
                    </button>
                  </div>

                  <div className={`cal-grid ${cargandoCal ? 'cal-grid--cargando' : ''}`} role="grid" aria-label="calendario de entrenamientos">
                    {DIAS.map((d) => <span key={d} className="cal-grid__semana">{d}</span>)}
                    {Array.from({ length: primerDiaSemana }, (_, i) => <span key={`v${i}`} />)}
                    {Array.from({ length: diasDelMes }, (_, i) => i + 1).map((d) => {
                      const f = `${prefijoMes}-${pad(d)}`;
                      const clases = ['cal-grid__dia'];
                      if (asistPorDia[f] === true) clases.push('cal-grid__dia--asistio');
                      if (asistPorDia[f] === false) clases.push('cal-grid__dia--fallo');
                      if (porDia[f]) clases.push('cal-grid__dia--entreno');
                      if (f === hoy) clases.push('cal-grid__dia--hoy');
                      if (f === diaSel) clases.push('cal-grid__dia--sel');
                      return (
                        <button key={f} type="button" className={clases.join(' ')} aria-pressed={f === diaSel}
                          aria-label={`${d} de ${MESES[mes.getMonth()]}${porDia[f] ? ', hay entrenamiento' : ''}`}
                          onClick={() => setDiaSel(f)}>
                          {d}
                        </button>
                      );
                    })}
                  </div>

                  <ul className="calendario__leyenda">
                    <li className="calendario__leyenda-item"><span className="calendario__punto calendario__punto--verde" /> Asistí</li>
                    <li className="calendario__leyenda-item"><span className="calendario__punto calendario__punto--rojo" /> Falté</li>
                  </ul>

                  {/* detalle del día: alto fijo con scroll interno, la tarjeta nunca crece */}
                  {delDia && (
                    <div className="cal-detalle">
                      <strong>{fechaLarga}</strong>
                      {delDia.length === 0 ? (
                        <p>Sin entrenamientos programados.</p>
                      ) : (
                        <ul className="cal-detalle__lista">
                          {delDia.map((e) => (
                            <li key={e.id}>
                              <span className="cal-detalle__hora">
                                {hora12(e.hora_inicio)}{e.hora_fin ? ` – ${hora12(e.hora_fin)}` : ''}
                              </span>
                              <span>{e.titulo || 'Entrenamiento'}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                <button type="button" className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--completo"
                  onClick={() => onNavigate(RUTAS.entrenamientos)}>
                  Ver entrenamientos
                </button>
              </article>

              {/* perfil */}
              <article className="tarjeta-dashboard tarjeta-perfil-atleta">
                <div className="tarjeta-dashboard__contenido perfil-atleta">
                  <figure className="perfil-atleta__foto"><img src={foto} alt={`Foto de ${nombreCompleto}`} /></figure>
                  <h3 className="perfil-atleta__nombre">{nombreCompleto}</h3>
                  <span className="insignia-categoria">{nombreNivel}</span>

                  <div className="perfil-atleta__stats">
                    <div className="perfil-atleta__stat">
                      <span className="perfil-atleta__stat-valor">{metricas.entrenamientos}</span>
                      <span className="perfil-atleta__stat-etiqueta">Entrenamientos</span>
                    </div>
                    <div className="perfil-atleta__stat">
                      <span className="perfil-atleta__stat-valor">{base.inscritos.length}</span>
                      <span className="perfil-atleta__stat-etiqueta">Torneos inscritos</span>
                    </div>
                  </div>

                  <div className="perfil-atleta__proximo">
                    <div className="perfil-atleta__proximo-etiqueta">
                      <Calendar size={14} strokeWidth={2} /> Próximo entrenamiento
                    </div>
                    <div className="perfil-atleta__proximo-info">
                      {prox ? (
                        <>
                          <span className="perfil-atleta__proximo-fecha">{prox.fecha}</span>
                          <span className="perfil-atleta__proximo-tipo">{prox.tipo}</span>
                        </>
                      ) : (
                        <span className="perfil-atleta__proximo-tipo">Sin entrenamientos próximos</span>
                      )}
                    </div>
                  </div>
                </div>
              </article>

              {/* mensualidades */}
              <article className="tarjeta-dashboard tarjeta-mensualidades">
                <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
                  <Wallet size={24} strokeWidth={2} /><h2>Mensualidades</h2>
                </header>

                <div className="tarjeta-dashboard__contenido pagos">
                  <div className="pago-item">
                    <span className="pago-item__etiqueta">Último pago</span>
                    {pagos.ultimo ? (
                      <>
                        <strong className="pago-item__valor">{moneda(pagos.ultimo.valor)}</strong>
                        <span className="pago-item__detalle">{pagos.ultimo.mes} · {fechaCorta(pagos.ultimo.fecha_pago)}</span>
                      </>
                    ) : <span className="pago-item__detalle">Sin pagos registrados</span>}
                  </div>

                  <div className={`pago-item pago-item--${pagos.estado === 'aldia' ? 'neutro' : pagos.estado}`}>
                    <span className="pago-item__etiqueta">Próximo pago</span>
                    {pagos.siguiente ? (
                      <>
                        <strong className="pago-item__valor">{moneda(pagos.siguiente.valor)}</strong>
                        <span className="pago-item__detalle">
                          {pagos.siguiente.mes} · vence {fechaCorta(pagos.siguiente.fecha_vencimiento)}
                          {pagos.dias !== null && (
                            <em>{pagos.dias < 0 ? ` (${Math.abs(pagos.dias)} d de retraso)` : pagos.dias === 0 ? ' (hoy)' : ` (en ${pagos.dias} d)`}</em>
                          )}
                        </span>
                      </>
                    ) : <span className="pago-item__detalle">No tienes pagos pendientes</span>}
                  </div>
                </div>

                <button type="button" className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--completo"
                  onClick={() => onNavigate(RUTAS.mensualidades)}>
                  Ver mis mensualidades
                </button>
              </article>

              {/* pqrs */}
              <article className="tarjeta-dashboard tarjeta-pqrs">
                <header className="tarjeta-dashboard__header tarjeta-dashboard__header--icono">
                  <MessageCircle size={24} strokeWidth={2} /><h2>PQRS</h2>
                </header>
                <div className="tarjeta-dashboard__contenido pqrs__resumen">
                  {pqrsResumen.map(({ id, texto }) => (
                    <span className={`insignia-pqrs insignia-pqrs--${id}`} key={id}>{texto}</span>
                  ))}
                </div>
                <button type="button" className="btn btn-primario tarjeta-dashboard__accion tarjeta-dashboard__accion--completo"
                  onClick={() => onNavigate(RUTAS.pqrs)}>
                  Ver mis Solicitudes
                </button>
              </article>
            </section>

            {/* próximos torneos (4 por página) */}
            <section className="tarjeta-dashboard tarjeta-torneos" aria-label="próximos torneos">
              <header className="tarjeta-dashboard__header torneos__header">
                <div className="torneos__titulo-grupo">
                  <h2>Próximos Torneos</h2>
                  <p className="torneos__subtitulo">Competencias programadas</p>
                </div>
                <div className="torneos__controles">
                  <span className="torneos__contador">{base.torneos.length} eventos</span>
                  {totalPagTorneo > 1 && (
                    <div className="torneos__paginador" role="group" aria-label="paginación de torneos">
                      <button type="button" aria-label="Anteriores" disabled={pagTorneo === 1} onClick={() => setPagTorneo(pagTorneo - 1)}>
                        <ChevronLeft size={16} strokeWidth={2.2} />
                      </button>
                      <span>{pagTorneo} / {totalPagTorneo}</span>
                      <button type="button" aria-label="Siguientes" disabled={pagTorneo >= totalPagTorneo} onClick={() => setPagTorneo(pagTorneo + 1)}>
                        <ChevronRight size={16} strokeWidth={2.2} />
                      </button>
                    </div>
                  )}
                </div>
              </header>

              <div className="torneos__lista">
                {base.torneos.length === 0 && <p className="torneos__vacio">No hay torneos programados.</p>}
                {torneosVisibles.map((t, i) => {
                  const f = fechaLocal(t.fecha);
                  const inscrito = base.inscritos.includes(String(t.id));
                  return (
                    <button type="button" key={t.id} className="torneo-card" style={{ animationDelay: `${0.05 * i}s` }}
                      onClick={() => onNavigate(RUTAS.torneo(t.id))}>
                      <div className={`torneo-card__fecha torneo-card__fecha--${inscrito ? 'rojo' : 'oscuro'}`}>
                        <span className="torneo-card__dia">{f.getDate()}</span>
                        <span className="torneo-card__mes">{MESES_CORTO[f.getMonth()]}</span>
                      </div>
                      <div className="torneo-card__info">
                        <span className="torneo-card__nombre">{t.nombre}</span>
                        <span className="torneo-card__lugar"><MapPin size={12} strokeWidth={2} />{t.lugar}</span>
                      </div>
                      <span className={`torneo-card__estado torneo-card__estado--${inscrito ? 'inscrita' : 'pendiente'}`}>
                        {inscrito ? 'Inscrita' : 'Por inscribir'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
      <AvisoToast aviso={aviso} />
    </div>
  );
}