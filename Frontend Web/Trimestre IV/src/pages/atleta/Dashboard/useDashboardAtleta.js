import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../services/supabase';
import {
  USAR_DATOS_DEMO, DEMO_SI_FALLA, DEMO_BASE,
  iso, dia10, cargarBase, obtenerEntrenos,
  calcularMetricas, resumirPqrs, resumirPagos,
} from './dashboardAtletaData.js';

/**
 * Todo el estado del dashboard del atleta: datos base, calendario,
 * próximo entrenamiento y métricas derivadas.
 */
export default function useDashboardAtleta(mostrarAviso) {
  const hoy = iso(new Date());

  /* ── datos base ── */
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
  const [mes, setMes] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [entrenos, setEntrenos] = useState([]);
  const [cargandoCal, setCargandoCal] = useState(false);
  const [diaSel, setDiaSel] = useState(hoy);
  const mesClave = `${mes.getFullYear()}-${mes.getMonth()}`;

  useEffect(() => {
    if (cargando) return;
    let vivo = true;
    setCargandoCal(true);
    obtenerEntrenos({
      demo, idNivel,
      desde: iso(mes),
      hasta: iso(new Date(mes.getFullYear(), mes.getMonth() + 1, 0)),
    })
      .then((r) => vivo && setEntrenos(r))
      .catch((e) => { if (vivo) { setEntrenos([]); mostrarAviso(e.message, 'error'); } })
      .finally(() => vivo && setCargandoCal(false));
    return () => { vivo = false; };
  }, [mesClave, cargando, idNivel, demo]);

  const porDia = useMemo(() => {
    const m = {};
    entrenos.forEach((e) => { const f = dia10(e.fecha); (m[f] ||= []).push(e); });
    return m;
  }, [entrenos]);

  const cambiarMes = (delta) => setMes(new Date(mes.getFullYear(), mes.getMonth() + delta, 1));

  /* ── próximo entrenamiento (siguientes 30 días) ── */
  const [proximo, setProximo] = useState(null);

  useEffect(() => {
    if (cargando) return;
    let vivo = true;
    const fin = new Date();
    fin.setDate(fin.getDate() + 30);
    obtenerEntrenos({ demo, idNivel, desde: hoy, hasta: iso(fin) })
      .then((r) => {
        if (!vivo) return;
        const ahora = new Date();
        const sig = r.find((e) => new Date(`${dia10(e.fecha)}T${e.hora_inicio || '23:59:00'}`) >= ahora);
        setProximo(sig ?? null);
      })
      .catch(() => vivo && setProximo(null));
    return () => { vivo = false; };
  }, [cargando, idNivel, demo]);

  /* ── métricas derivadas ── */
  const metricas = useMemo(() => calcularMetricas(base.evals, base.asist), [base.evals, base.asist]);
  const pqrsResumen = useMemo(() => resumirPqrs(base.pqrs), [base.pqrs]);
  const pagos = useMemo(() => resumirPagos(base.pagos, hoy), [base.pagos, hoy]);

  return {
    base, hoy, metricas, pqrsResumen, pagos, proximo,
    calendario: { mes, cambiarMes, porDia, cargando: cargandoCal, diaSel, setDiaSel },
  };
}