import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <PageTransition>
      <div className={styles.page}>
        <div className={styles.inner}>
          <span className={styles.code}>404</span>
          <h1 className={styles.title}>Página no encontrada</h1>
          <p className={styles.sub}>La página que buscas no existe o ha sido movida.</p>
          <Link to="/" className="btn-dark">Volver al inicio</Link>
        </div>
      </div>
    </PageTransition>
  )
}
