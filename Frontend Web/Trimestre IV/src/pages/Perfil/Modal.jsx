export default function Modal({ abierto, onCerrar, children, className = '', labelledBy }) {
  if (!abierto) return null;
  return (
    <div
      className="perfil-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onCerrar(); }}
    >
      <div className={`perfil-modal ${className}`} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {children}
      </div>
    </div>
  );
}