import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <div className={styles.brand}>Carolina Peñacoba</div>
          <p className={styles.desc}>
            Pintora especializada en acrílico con texturas y acuarela.
            Catálogo propio y encargos personalizados desde Madrid.
          </p>
        </div>
        <div>
          <div className={styles.colH}>Páginas</div>
          <ul className={styles.links}>
            <li><Link to="/galeria">Galería</Link></li>
            <li><Link to="/sobre">Sobre mí</Link></li>
            <li><Link to="/encargos">Encargos</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <div className={styles.colH}>Contacto</div>
          <ul className={styles.links}>
            <li><a href="mailto:estudiodecarolina@gmail.com">estudiodecarolina@gmail.com</a></li>
            <li>
              <a href="https://www.instagram.com/carolinapenacoba" target="_blank" rel="noreferrer">
                @carolinapenacoba
              </a>
            </li>
            <li><span>Cotos de Monterrey, Madrid</span></li>
          </ul>
        </div>
      </div>

      <div className={styles.bot}>
        <span className={styles.copy}>
          © {year} Carolina Peñacoba · Todos los derechos reservados
        </span>
        <a
          href="https://www.instagram.com/carolinapenacoba"
          target="_blank"
          rel="noreferrer"
          className={styles.ig}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
          </svg>
          Instagram
        </a>
      </div>
    </footer>
  )
}
