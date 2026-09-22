
import React, { useEffect, useId } from "react";

export default function ModalBase({
  titulo,
  subtitulo,
  icono,
  estado,
  pie,
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
        className="modal show d-block pqa-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) cerrar();
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <form
            className="modal-content"
            onSubmit={onSubmit ?? ((e) => e.preventDefault())}
            noValidate
          >
            <div className="modal-header">
              {icono && (
                <span className={`pqa-modal__icono pqa-fondo--${estado}`} aria-hidden="true">
                  <i className={`bi ${icono}`} />
                </span>
              )}

              <div className="pqa-modal__textos">
                <h2 className="modal-title" id={idTitulo}>
                  {titulo}
                </h2>
                <p className="pqa-modal__sub">{subtitulo}</p>
              </div>

              <button
                type="button"
                className="pqa-modal__cerrar"
                aria-label="Cerrar"
                disabled={enviando}
                onClick={cerrar}
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            <div className="modal-body">{children}</div>

            <div className="modal-footer">{pie}</div>
          </form>
        </div>
      </div>

      <div className="modal-backdrop show pqa-backdrop" />
    </>
  );
}
