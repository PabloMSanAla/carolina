import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import styles from './Encargos.module.css'

export default function Encargos() {
  return (
    <PageTransition>
      <div className={styles.page}>
        <div className={styles.inner}>
          <p className="sec-eyebrow">Encargos</p>
          <h1 className={styles.title}>
            ¿Tienes en mente<br />una <em>obra propia</em>?
          </h1>
          <p className={styles.sub}>
            Creo piezas a medida: el espacio, los colores, el formato, el ritmo.
            Me cuentas la idea y yo propongo el camino. Sin compromiso.
          </p>
          <Link to="/contacto" className="btn-dark">Escribirme</Link>

          <div className={styles.steps}>
            {[
              {
                n: '01', name: 'Conversación',
                txt: 'Me cuentas el espacio, la paleta y lo que buscas transmitir.',
              },
              {
                n: '02', name: 'Propuesta',
                txt: 'Comparto boceto, materiales y precio estimado.',
              },
              {
                n: '03', name: 'Ejecución',
                txt: 'Creo la pieza con actualizaciones a lo largo del proceso.',
              },
            ].map(s => (
              <div key={s.n} className={styles.step}>
                <div className={styles.stepN}>{s.n}</div>
                <div className={styles.stepName}>{s.name}</div>
                <p className={styles.stepTxt}>{s.txt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Galería de inspiración */}
        <div className={styles.inspiration}>
          <p className="sec-eyebrow" style={{ marginBottom: '2rem' }}>Inspiración</p>
          <div className={styles.inspGrid}>
            {[
              '/images/obras/irrupcion/thumb.webp',
              '/images/obras/estratos-de-arena/thumb.webp',
              '/images/obras/margenes-de-nieve/thumb.webp',
              '/images/obras/horizonte-dorado/thumb.webp',
            ].map((src, i) => (
              <img key={i} src={src} alt={`Ejemplo de encargo ${i + 1}`} loading="lazy" />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
