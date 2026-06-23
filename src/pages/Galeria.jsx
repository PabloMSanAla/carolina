import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import ObraCard from '../components/ObraCard'
import { obras } from '../data/obras'
import styles from './Galeria.module.css'

const FILTERS = [
  { label: 'Todas', value: 'all' },
  { label: 'Disponibles', value: 'disp' },
  { label: 'Vendidas', value: 'vend' },
]

export default function Galeria() {
  const [filter, setFilter] = useState('all')

  const visible = filter === 'all' ? obras : obras.filter(o => o.status === filter)

  return (
    <PageTransition>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <p className="sec-eyebrow">Obra</p>
            <h1 className="sec-title">Galería</h1>
          </div>
          <div className={styles.filterRow}>
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`${styles.fbtn} ${filter === f.value ? styles.on : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className={styles.grid}>
          <AnimatePresence>
            {visible.map(obra => (
              <motion.div
                key={obra.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <ObraCard obra={obra} size="sq" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageTransition>
  )
}
