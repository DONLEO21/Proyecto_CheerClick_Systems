import { useState, useRef } from 'react'

export default function useAviso() {
  const [aviso, setAviso] = useState({ mensaje: '', tipo: 'advertencia', visible: false })
  const timer = useRef(null)

  const mostrarAviso = (mensaje, tipo = 'advertencia') => {
    clearTimeout(timer.current)
    setAviso({ mensaje, tipo, visible: true })
    timer.current = setTimeout(() => setAviso((a) => ({ ...a, visible: false })), 4000)
  }

  return { aviso, mostrarAviso }
}