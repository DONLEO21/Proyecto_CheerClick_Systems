import { useEffect, useMemo, useState } from "react";
import { cargarUsuarios } from "../../../services/adminUsuarios";

export default function useDashboardAdmin() {
  const [cuentas, setCuentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarUsuarios()
      .then(setCuentas)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  // Usuarios = cuentas ya aprobadas (activas o desactivadas)
  const stats = useMemo(() => {
    const aprobadas = cuentas.filter((c) => c.estado === "aprobada");
    const activos = aprobadas.filter((c) => c.activo).length;
    return {
      total: aprobadas.length,
      activos,
      inactivos: aprobadas.length - activos,
    };
  }, [cuentas]);

  // Todas las solicitudes pendientes (sin filtrar)
  const pendientes = useMemo(
    () => cuentas.filter((c) => c.estado === "pendiente"),
    [cuentas],
  );

  return { stats, pendientes, cargando, error };
}