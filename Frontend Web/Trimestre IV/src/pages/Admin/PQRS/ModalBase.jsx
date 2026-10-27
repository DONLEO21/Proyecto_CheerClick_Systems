
import { useEffect, useId } from "react";
export default function ModalBase({
  titulo,
  subtitulo,
  icono,
  textoAccion,
  iconoAccion,
  enviando = false,
  onCerrar,
  onSubmit,
  children,
}) {
  const idTitulo = useId();
  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

 
  const cerrar = () => {
    if (!enviando) onCerrar();
  };

  useEffect(() => {
    const alPresionar = (e) => {
      if (e.key === "Escape" && !enviando) onCerrar();
    };
    document.addEventListener("keydown", alPresionar);
    return () => document.removeEventListener("keydown", alPresionar);
  }, [onCerrar, enviando]);

  return (
    <>
      <div
        className="modal show d-block pqrs-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) cerrar();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form className="modal-content" onSubmit={onSubmit} noValidate>
            <div className="modal-header">
              {icono && (
                <span className="pqrs-modal-icono" aria-hidden="true">
                  <i className={`bi ${icono}`} />
                </span>
              )}

              <div className="flex-grow-1">
                <h2 className="modal-title" id={idTitulo}>
                  {titulo}
                </h2>
                <p className="pqrs-modal-sub">{subtitulo}</p>
              </div>

              <button
                type="button"
                className="pqrs-modal-cerrar"
                aria-label="Cerrar"
                disabled={enviando}
                onClick={cerrar}
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            <div className="modal-body">{children}</div>

            <div className="modal-footer">
              <button type="button" className="btn pqrs-btn-cancelar" disabled={enviando} onClick={cerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn pqrs-btn-primario" disabled={enviando}>
                {enviando ? (
                  <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                ) : (
                  <i className={`bi ${iconoAccion}`} aria-hidden="true" />
                )}
                {textoAccion}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="modal-backdrop show pqrs-backdrop" />
    </>
  );
}
