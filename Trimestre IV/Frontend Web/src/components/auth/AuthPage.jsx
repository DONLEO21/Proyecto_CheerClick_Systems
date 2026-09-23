import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import Login from "./Login";
import Registro from "./Registro";
import CuentaPendiente from "./CuentaPendiente";
import RecuperarCorreo from "./RecuperarCorreo";
import RecuperarCodigo from "./RecuperarCodigo";
import RecuperarClave from "./RecuperarClave";
import RecuperarExito from "./RecuperarExito";
import "./auth.css";

const INICIO = {
  administrador: "/admin",
  entrenador: "/entrenador",
  atleta: "/atleta",
};

function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vistaInicial =
    searchParams.get("view") === "registro" ? "registro" : "login";

  const [pantalla, setPantalla] = useState(vistaInicial);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");

  useEffect(() => {
    if (pantalla.startsWith("recuperar")) return;

    let activo = true;

    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user;
      if (!activo || !u) return;

      const esAdmin = u.app_metadata?.rol_admin === true;
      const aprobada = u.app_metadata?.estado === "aprobada";
      const desactivada = u.app_metadata?.activo === false;
      const rol = esAdmin ? "administrador" : u.user_metadata?.rol;

      if ((esAdmin || (aprobada && !desactivada)) && INICIO[rol]) {
        navigate(INICIO[rol], { replace: true });
      }
    });

    return () => {
      activo = false;
    };
  }, [navigate, pantalla]);

  return (
    <div className="pagina-auth">
      <div className="contenedor">
        {pantalla === "login" && <Login irA={setPantalla} />}
        {pantalla === "registro" && <Registro irA={setPantalla} />}
        {pantalla === "pendiente" && <CuentaPendiente irA={setPantalla} />}
        {pantalla === "recuperar-correo" && (
          <RecuperarCorreo
            irA={setPantalla}
            setCorreo={setCorreoRecuperacion}
          />
        )}
        {pantalla === "recuperar-codigo" && (
          <RecuperarCodigo irA={setPantalla} correo={correoRecuperacion} />
        )}
        {pantalla === "recuperar-clave" && <RecuperarClave irA={setPantalla} />}
        {pantalla === "recuperar-exito" && <RecuperarExito irA={setPantalla} />}
      </div>
    </div>
  );
}

export default AuthPage;