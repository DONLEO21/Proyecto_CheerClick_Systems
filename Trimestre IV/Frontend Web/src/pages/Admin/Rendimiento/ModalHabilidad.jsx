import { useEffect, useRef, useState } from "react";

const HABILIDAD_VACIA = { texto: "", nivel: "", categoria: "" };

function ModalHabilidad({ habilidad, onCerrar, onGuardar }) {
  const modalRef = useRef(null);
  const [form, setForm] = useState(HABILIDAD_VACIA);


  useEffect(() => {
    modalRef.current?.showModal();
  }, []);


  useEffect(() => {
    setForm(habilidad ? { ...habilidad } : HABILIDAD_VACIA);
  }, [habilidad]);

  const cerrar = () => {
    modalRef.current?.close();
    onCerrar();
  };

  const handleChange = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const handleGuardar = () => {
    if (!form.texto.trim() || !form.nivel || !form.categoria) {
      alert("Completa nombre, nivel y tipo de la habilidad.");
      return;
    }
    onGuardar(form);
  };

  const handleClickFuera = (e) => {
    const rect = modalRef.current.getBoundingClientRect();
    const clickFuera =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (clickFuera) cerrar();
  };

  return (
    <dialog id="menu-regis" ref={modalRef} onClick={handleClickFuera}>
      <aside id="cabe-menu">
        <div id="infor-cabe">
          <span id="titu-menu">
            {habilidad ? "Editar habilidad" : "Nueva habilidad"}
          </span>
        </div>
        <div id="x-cabe">
          <svg
            id="sim-x"
            onClick={cerrar}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </div>
      </aside>

      <section>
        <div id="res-pag">
          <div className="conte-inpu">
            <label className="label-titu">Nombre de la habilidad</label>
            <input
              type="text"
              placeholder="Ej: Invertida en nivel PREP"
              value={form.texto}
              onChange={handleChange("texto")}
            />
          </div>
        </div>

        <div id="res-pago">
          <div className="conte-input">
            <label className="label-titu">Nivel</label>
            <select value={form.nivel} onChange={handleChange("nivel")}>
              <option value="">Nivel</option>
              <option value="Nivel 1 Youth">Nivel 1 Youth</option>
              <option value="Nivel 3 Open">Nivel 3 Open</option>
              <option value="Nivel 4 Open Large">Nivel 4 Open Large</option>
            </select>
          </div>

          <div className="conte-input">
            <label className="label-titu">Tipo</label>
            <select
              value={form.categoria}
              onChange={handleChange("categoria")}
            >
              <option value="">Tipo</option>
              <option value="apropiada">Apropiada</option>
              <option value="avanzada">Avanzada</option>
              <option value="elite">Élite</option>
            </select>
          </div>
        </div>
      </section>

      <section id="conte-btn">
        <button onClick={cerrar} id="cancelar">
          Cancelar
        </button>
        <button onClick={handleGuardar} id="registrar">
          Guardar
        </button>
      </section>
    </dialog>
  );
}

export default ModalHabilidad;