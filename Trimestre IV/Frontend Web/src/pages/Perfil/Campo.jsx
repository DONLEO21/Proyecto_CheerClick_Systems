export default function Campo({ id, label, icono: Icono, children, aviso }) {
  return (
    <div className="form-grupo">
      <div className="form-grupo__cabecera">
        <label htmlFor={id}>{label}</label>
        {aviso && <small className="campo-aviso">{aviso}</small>}
      </div>
      <div className="campo-icono-perfil">
        <Icono size={16} />
        {children}
      </div>
    </div>
  );
}