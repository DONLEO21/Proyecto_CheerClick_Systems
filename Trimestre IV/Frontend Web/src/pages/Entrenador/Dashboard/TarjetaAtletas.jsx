import { useEffect, useState } from 'react'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { MAX_ITEMS } from './dashboardEntrenadorData.js'

function PieTabla({ pagina, totalPaginas, total, desde, hasta, onCambiar }) {
  if (total <= MAX_ITEMS) return null
  return (
    <footer className="de-pie">
      <span>Mostrando {desde}–{hasta} de {total}</span>
      <div className="de-paginador" role="group" aria-label="paginación de atletas">
        <button type="button" aria-label="Página anterior" disabled={pagina === 1} onClick={() => onCambiar(pagina - 1)}>
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
        <span className="de-paginador__indicador">{pagina} / {totalPaginas}</span>
        <button type="button" aria-label="Página siguiente" disabled={pagina >= totalPaginas} onClick={() => onCambiar(pagina + 1)}>
          <ChevronRight size={18} strokeWidth={2.2} />
        </button>
      </div>
    </footer>
  )
}

export default function TarjetaAtletas({ atletas, niveles, nombreNivel, tieneNivel, cargando }) {
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [pagina, setPagina] = useState(1)

  useEffect(() => { setPagina(1) }, [busqueda, categoria])

  const filtrados = atletas.filter(
    (a) =>
      (!categoria || String(a.id_nivel) === categoria) &&
      `${a.nombre} ${a.codigo ?? ''}`.toLowerCase().includes(busqueda.trim().toLowerCase())
  )
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / MAX_ITEMS))
  const paginaActual = Math.min(pagina, totalPaginas)
  const inicio = (paginaActual - 1) * MAX_ITEMS
  const visibles = filtrados.slice(inicio, inicio + MAX_ITEMS)

  const textoVacio = !tieneNivel
    ? 'Aún no tienes un nivel asignado.'
    : atletas.length === 0
      ? 'No hay atletas asignados a tu nivel.'
      : 'Ningún atleta coincide con tu búsqueda.'

  return (
    <article className="de-tarjeta de-col-9">
      <div className="de-filtros">
        <label className="de-campo">
          <Search size={18} strokeWidth={2} />
          <input type="search" placeholder="Buscar atleta" value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} />
        </label>
        <label className="de-campo">
          <Filter size={18} strokeWidth={2} />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} disabled={!tieneNivel}>
            <option value="">Filtrar por categoría</option>
            {niveles.map((n) => <option key={n.id} value={String(n.id)}>{n.nombre}</option>)}
          </select>
        </label>
      </div>

      <div className="de-lista-cabeza">
        <h2 className="de-titulo">Lista de Atletas</h2>
        <span className="de-contador">
          {cargando ? '…' : filtrados.length} {filtrados.length === 1 ? 'atleta' : 'atletas'}
        </span>
      </div>

      <div className="de-tabla-wrap">
        <table className="de-tabla">
          <thead>
            <tr><th>Atleta</th><th>Categoría</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {visibles.map((a) => (
              <tr key={a.id}>
                <td>
                  <div className="de-atleta">
                    <span className="de-avatar">{a.nombre?.[0]?.toUpperCase() ?? '?'}</span>
                    <span>{a.nombre}</span>
                  </div>
                </td>
                <td><span className="de-nivel">{nombreNivel[String(a.id_nivel)] ?? 'Sin nivel'}</span></td>
                <td>
                  <span className={`de-estado ${a.activo ? 'de-estado--activo' : 'de-estado--inactivo'}`}>
                    {a.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
            {cargando && <tr><td colSpan={3} className="de-vacio">Cargando atletas...</td></tr>}
            {!cargando && filtrados.length === 0 && <tr><td colSpan={3} className="de-vacio">{textoVacio}</td></tr>}
          </tbody>
        </table>
      </div>

      <PieTabla
        pagina={paginaActual} totalPaginas={totalPaginas} total={filtrados.length}
        desde={inicio + 1} hasta={inicio + visibles.length} onCambiar={setPagina}
      />
    </article>
  )
}