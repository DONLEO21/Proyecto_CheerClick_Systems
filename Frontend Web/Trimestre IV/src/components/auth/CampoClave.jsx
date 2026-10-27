import { useState } from 'react'

const ICONO_OJO = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const ICONO_OJO_TACHADO = (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
    <path d="m2 2 20 20" />
  </svg>
)

function CampoClave({ id, placeholder, value, onChange }) {
  const [verClave, setVerClave] = useState(false)

  return (
    <div className="clave-contenedor">
      <input
        className="campo"
        type={verClave ? 'text' : 'password'}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button
        className="boton-ojo"
        type="button"
        onClick={() => setVerClave(!verClave)}
        aria-label={verClave ? 'Ocultar contraseña' : 'Ver contraseña'}
      >
        {verClave ? ICONO_OJO_TACHADO : ICONO_OJO}
      </button>
    </div>
  )
}

export default CampoClave