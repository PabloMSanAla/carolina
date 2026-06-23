import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './ObraCard.module.css'

export default function ObraCard({ obra, size = 'sq' }) {
  const sizeClass = {
    big: styles.big,
    tall: styles.tall,
    sq: styles.sq,
    land: styles.land,
  }[size] || styles.sq

  return (
    <Link to={`/obras/${obra.slug}`} className={styles.card}>
      <div className={`${styles.imgWrap} ${sizeClass}`}>
        <motion.img
          src={obra.portada}
          alt={obra.titulo}
          loading="lazy"
          decoding="async"
          width={700}
          height={700}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        {obra.status === 'disp' && (
          <span className={styles.badge}>Disponible</span>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{obra.titulo}</div>
        <div className={styles.tags}>
          <span className={styles.tag}>{obra.tecnica}</span>
          <span className={styles.sep}>·</span>
          <span className={`${styles.tag} ${obra.status === 'disp' ? styles.disp : styles.vend}`}>
            {obra.status === 'disp' ? 'Disponible' : 'Vendido'}
          </span>
        </div>
      </div>
    </Link>
  )
}
