import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <Link to="/" className={styles.brand}>Carolina Peñacoba</Link>

      <button
        className={`${styles.burger} ${menuOpen ? styles.open : ''}`}
        aria-label="Abrir menú"
        onClick={() => setMenuOpen(v => !v)}
      >
        <span /><span /><span />
      </button>

      <ul className={`${styles.links} ${menuOpen ? styles.mobileOpen : ''}`}>
        <li><NavLink to="/galeria" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>Galería</NavLink></li>
        <li><NavLink to="/sobre" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>Sobre mí</NavLink></li>
        <li><NavLink to="/encargos" className={({ isActive }) => isActive ? styles.active : ''} onClick={() => setMenuOpen(false)}>Encargos</NavLink></li>
        <li>
          <NavLink to="/contacto" className={`${styles.cta} ${styles.navCta}`} onClick={() => setMenuOpen(false)}>
            Contacto
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
