import { useEffect, useRef } from "react";

function Modal({ id, abierto, onCerrar, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      id={id}
      ref={ref}
      onClose={onCerrar}
      onCancel={onCerrar}
      onClick={(e) => {
        if (e.target === ref.current) onCerrar();
      }}
    >
      {children}
    </dialog>
  );
}

export default Modal;