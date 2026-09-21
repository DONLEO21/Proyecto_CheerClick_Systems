import { forwardRef } from "react";

const ModalGuardado = forwardRef(function ModalGuardado({ categoriaLabel, fecha, onAceptar }, ref) {
  const cerrar = () => {
    ref.current?.close();
    onAceptar?.();
  };

  return (
    <dialog ref={ref} id="modal-guardado">
      <div className="modal-exito">
        <div className="modal-exito-icono">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2>Asistencia registrada correctamente</h2>
        <p>
          La lista de asistencia para la categoría {categoriaLabel} del día {fecha} ha sido registrada con
          éxito dentro del sistema.
        </p>
        <button type="button" className="btn-aceptar" onClick={cerrar}>Aceptar</button>
      </div>
    </dialog>
  );
});

export default ModalGuardado;
