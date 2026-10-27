import { createContext, useContext, useState, useEffect } from "react";

const SesionContext = createContext(null);

const SESION_POR_DEFECTO = { rol: "atleta", atletaId: "1" };

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(() => {
    const guardada = localStorage.getItem("sesion");
    return guardada ? JSON.parse(guardada) : SESION_POR_DEFECTO;
  });

  useEffect(() => {
    localStorage.setItem("sesion", JSON.stringify(sesion));
  }, [sesion]);

  return (
    <SesionContext.Provider value={{ sesion, setSesion }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error("useSesion debe usarse dentro de <SesionProvider>");
  return ctx;
}