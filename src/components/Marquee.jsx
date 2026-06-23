import styles from './Marquee.module.css'

const items = [
  'Acrílico con texturas',
  'Acuarela',
  'Técnica mixta',
  'Obras por encargo',
  'Madrid',
  'Catálogo disponible',
]

export default function Marquee() {
  const doubled = [...items, ...items]

  return (
    <div className={styles.strip} aria-hidden="true">
      <div className={styles.inner}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            {i < doubled.length - 1 && <span className={styles.dot}>·</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
