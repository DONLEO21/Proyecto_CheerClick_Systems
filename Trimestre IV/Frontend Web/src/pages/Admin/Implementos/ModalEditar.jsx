import { forwardRef, useEffect, useState, useRef } from "react";
import { actualizarImplemento } from "../../../services/ImplementosService";

const ModalEditar = forwardRef(function ModalEditar({ implemento, onGuardado }, ref) {
  const [form, setForm] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (implemento) setForm(implemento);
  }, [implemento]);

  const cerrar = () => {
    setError("");
    ref.current.close();
  };

  if (!form) return <dialog ref={ref} className="dialog-bootstrap" />;

  const handleChange = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      await actualizarImplemento(form.id, {
        ...form,
        cantidad: Number(form.cantidad),
        precio: Number(form.precio),
      });
      onGuardado();
      cerrar();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleImagen = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no debe superar 2 MB");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => handleChange("imagen", reader.result);
    reader.readAsDataURL(file);
  };

  const redimensionar = (file, maxSize = 400, calidad = 0.8) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * escala;
      canvas.height = img.height * escala;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", calidad));
    };
    img.src = URL.createObjectURL(file);
  });

  return (
    <dialog ref={ref} className="dialog-bootstrap">
      <div className="modal-content shadow-lg border-0" style={{ width: "min(450px, 90vw)", borderRadius: "12px", overflow: "hidden" }}>

        <div className="modal-header bg-danger text-white border-0 py-3 px-4">
          <div>
            <h5 className="modal-title fw-bold mb-0" style={{ fontSize: "1.2rem" }}>Editar Implemento</h5>
            <small className="opacity-75">{form.nombre}</small>
          </div>
          <button type="button" className="btn-close btn-close-white ms-auto" onClick={cerrar}></button>
        </div>

        <form onSubmit={handleGuardar}>
          <div className="modal-body p-4 bg-white">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <div className="row align-items-center mb-3 g-3">
              <div className="col-3 text-center">
                <div className="col-3 text-center">
                  <div
                    className="foto-editable"
                    role="button"
                    tabIndex={0}
                    title="Cambiar imagen"
                    onClick={() => fileRef.current.click()}
                    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current.click()}
                  >
                    <img
                      src={form.imagen || "/img/placeholder.png"}
                      alt={form.nombre}
                      className="img-modal"
                    />
                    <span className="badge-editar-foto">
                      <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      </svg>
                    </span>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImagen} />
                  </div>
                </div>
              </div>
              <div className="col-9">
                <label className="form-label small fw-bold text-secondary mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-6">
                <label className="form-label small fw-bold text-secondary mb-1">Cantidad</label>
                <div className="input-group">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-2.5"
                    onClick={() => handleChange("cantidad", Math.max(0, Number(form.cantidad) - 1))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="form-control text-center px-1"
                    value={form.cantidad}
                    onChange={(e) => handleChange("cantidad", e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-2.5"
                    onClick={() => handleChange("cantidad", Number(form.cantidad) + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="col-6">
                <label className="form-label small fw-bold text-secondary mb-1">Tipo</label>
                <select
                  className="form-select"
                  value={form.tipo}
                  onChange={(e) => handleChange("tipo", e.target.value)}
                >
                  <option value="Ropa">Ropa</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Calzado">Calzado</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label small fw-bold text-secondary mb-1">Estado</label>
                <select
                  className="form-select"
                  value={form.estado}
                  onChange={(e) => handleChange("estado", e.target.value)}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="No Disponible">No disponible</option>
                </select>
              </div>

              <div className="col-6">
                <label className="form-label small fw-bold text-secondary mb-1">Precio</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.precio}
                  onChange={(e) => handleChange("precio", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer bg-light border-top-0 d-flex justify-content-end gap-2 p-3">
            <button type="button" className="btn btn-outline-secondary px-4" onClick={cerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-danger px-4" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
});

export default ModalEditar;