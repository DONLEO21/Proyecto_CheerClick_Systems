import { Shield, Lock } from 'lucide-react';

export default function TarjetaSeguridad({ onCambiarContrasena }) {
  return (
    <div className="tarjeta-p tarjeta-p--lateral">
      <div className="seccion-titulo">
        <span className="seccion-titulo__icono"><Shield size={17} /></span>
        <div>
          <h3>Seguridad</h3>
          <p className="seccion-titulo__sub">Protege tu cuenta y mantén tu información segura</p>
        </div>
      </div>
      <button
        type="button" className="btn btn-outline-rojo btn-bloque"
        onClick={onCambiarContrasena}
      >
        <Lock size={15} />
        Cambiar contraseña
      </button>
    </div>
  );
}