const navegarLinks = [
  ['#nosotros', 'Nosotros'],
  ['#servicios', 'Servicios'],
  ['#niveles', 'Niveles'],
  ['#horarios', 'Horarios'],
  ['#inscripcion', 'Inscripción'],
]

const redesSociales = [
  ['https://www.instagram.com/bloodtigerscheer?igsh=N25wOHRrcncxZHd3', '../src/assets/img/instagram.png', 'Instagram'],
  ['https://www.facebook.com/share/199JfMndTT/', '../src/assets/img/facebook.png', 'Facebook'],
  ['https://www.tiktok.com/@bloodtigerscheer_?_r=1&_t=ZS-97DUZ4Se2su', '../src/assets/img/tik-tok.png', 'TikTok'],
]

function Footer() {
  return (
    <footer>
      <section id="footer">
        <div className="contenedor">
          <div className="footer-contenido">

            {/* columna izquierda con logo, contacto, explorar y redes */}
            <div className="footer-columnas">
              <div className="footer-columna">
                <img src="../src/assets/img/Logo-Club.png" alt="Logo Blood Tigers" />
                <p>Blood Tigers Cheer</p>
                <p>Disciplina • Pasión • Trabajo en Equipo</p>
              </div>

              <div className="footer-columna">
                <h3>Contacto</h3>
                <p>
                  <a href="mailto:bloodtigerscheer@gmail.com" target="_blank">
                    <img src="../src/assets/img/mail.svg" alt="Correo" />bloodtigerscheer@gmail.com
                  </a>
                </p>
                <p>
                  <a href="tel:+573044740671" target="_blank">
                    <img src="../src/assets/img/telefono.svg" alt="Teléfono" />+57 304 474 06 71
                  </a>
                </p>
              </div>

              <div className="footer-columna">
                <h3>Explorar</h3>
                <ul>
                  {navegarLinks.map(([href, texto]) => (
                    <li key={texto}><a href={href}>{texto}</a></li>
                  ))}
                </ul>
              </div>

              <div className="footer-columna">
                <h3>Redes Sociales</h3>
                <ul>
                  {redesSociales.map(([url, icono, nombre]) => (
                    <li key={nombre}>
                      <a href={url} target="_blank">
                        <img src={icono} alt={nombre} />{nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* columna derecha: "cómo llegar" + mapa */}
            <div className="footer-mapa">
              <div className="footer-mapa-info">
                <h3>Cómo llegar</h3>
                <p>Cl. 65g Sur # 79B-26, Bosa, Bogotá D.C.</p>
              </div>
              <div className="footer-mapa-link">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.9333019625146!2d-74.186487!3d4.605964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9e43bb61d751%3A0x69174d74d0cf81c8!2zQ2wuIDY1ZyBTdXIgIyA3OUItMjYsIEJvc2EsIEJvZ290w6EsIEQuQy4sIEJvZ290w6EsIEJvZ290w6EsIEQuQy4!5e0!3m2!1ses-419!2sco!4v1782699841626!5m2!1ses-419!2sco"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="footer-copy">
            <p>© 2026 Blood Tigers Cheer — Todos los derechos reservados.</p>
          </div>
        </div>
      </section>
    </footer>
  )
}

export default Footer