import { useCallback, useEffect, useState } from "react";
import { obtenerDatosRendimiento } from "../services/rendimientoAtletaService";

export default function useRendimientoAtleta(atletaId) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: "" });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelado = false;
    obtenerDatosRendimiento(atletaId)
      .then((datos) => {
        if (!cancelado) setEstado({ datos, cargando: false, error: "" });
      })
      .catch((e) => {
        if (!cancelado) setEstado((previo) => ({ datos: previo.datos?.atleta && String(previo.datos.atleta.id) === String(atletaId) ? previo.datos : null, cargando: false, error: e.message }));
      });
    return () => {
      cancelado = true;
    };
  }, [atletaId, version]);

  const recargar = useCallback(() => {
    setEstado((previo) => ({ ...previo, cargando: previo.datos === null, error: "" }));
    setVersion((v) => v + 1);
  }, []);

  return { ...estado, recargar };
}
