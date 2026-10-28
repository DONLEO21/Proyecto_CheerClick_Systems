import { forwardRef, useState } from "react";
import { crearImplemento } from "../../../services/ImplementosService";

const vacio = {
  codigo: "",
  nombre: "",
  tipo: "",
  cantidad: "",
  estado: "",
  precio: "",
  imagen: "",
};

const ModalAgregar = forwardRef(function ModalAgregar({ onGuardado }, ref) {
  const [form, setForm] = useState(vacio);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleFoto = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => setForm((prev) => ({ ...prev, imagen: lector.result }));
    lector.readAsDataURL(archivo);
  };

  const cerrar = () => {
    setForm(vacio);
    setError("");
    ref.current.close();
  };

  const handleGuardar = async () => {
    if (!form.nombre.trim() || !form.tipo || !form.estado) {
      setError("Nombre, tipo y estado son obligatorios.");
      return;
    }
    setGuardando(true);
    setError("");
    try {
      await crearImplemento({
        ...form,
        cantidad: Number(form.cantidad) || 0,
        precio: Number(form.precio) || 0,
        codigo: form.codigo || `IM${Math.floor(Math.random() * 900 + 100)}`,
      });
      onGuardado();
      cerrar();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <dialog ref={ref} className="dialog-bootstrap">
      <div className="modal-content" style={{ width: "min(520px, 90vw)" }}>
        <div className="modal-header bg-danger text-white">
          <div>
            <h5 className="modal-title mb-0">Registrar Nuevo Implemento Deportivo</h5>
            <small>Introduce los datos detallados del implemento deportivo.</small>
          </div>
          <button type="button" className="btn-close btn-close-white" onClick={cerrar}></button>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="modal-body p-4">
            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="row g-4">
              <div className="col-6">
                <label htmlFor="nombre" className="form-label">Nombre del implemento</label>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre del elemento"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="col-6">
                <label htmlFor="tipo" className="form-label">Tipo</label>
                <select id="tipo" className="form-select" value={form.tipo} onChange={handleChange}>
                  <option value="" disabled>Categoría</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Calzado">Calzado</option>
                </select>
              </div>

              <div className="col-6">
                <label htmlFor="cantidad" className="form-label">Cantidad</label>
                <input
                  type="number"
                  id="cantidad"
                  className="form-control"
                  placeholder="Ingrese cantidad"
                  value={form.cantidad}
                  onChange={handleChange}
                />
              </div>

              <div className="col-6">
                <label htmlFor="estado" className="form-label">Estado</label>
                <select id="estado" className="form-select" value={form.estado} onChange={handleChange}>
                  <option value="" disabled>Seleccione estado</option>
                  <option value="Disponible">Disponible</option>
                  <option value="No Disponible">No disponible</option>
                </select>
              </div>

              <div className="col-12">
                <label htmlFor="precio" className="form-label">Precio</label>
                <input
                  type="number"
                  id="precio"
                  className="form-control"
                  placeholder="Ingrese precio"
                  value={form.precio}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Agregar foto:</label>
                <label className="dropzone-foto mb-0">
                  <input type="file" accept="image/*" onChange={handleFoto} />
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
                      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                      <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                    </svg>
                  </span>
                  <span>
                    Arrastra una imagen aquí o <strong>haga click para subir</strong>
                  </span>
                </label>
                {form.imagen && <img src={form.imagen} alt="Vista previa" className="img-modal mt-2" />}
              </div>
            </div>
          </div>

          <div className="modal-footer p-3 gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={cerrar}>Cancelar</button>
            <button type="button" className="btn btn-danger" onClick={handleGuardar} disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar Implemento"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
});

export default ModalAgregar;