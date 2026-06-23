import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { obraBySlug, obras } from '../data/obras'
import styles from './ObraDetail.module.css'

export default function ObraDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const obra = obraBySlug(slug)
  const [lightbox, setLightbox] = useState(null)

  const handlePrev = () => {
    const images = obra?.detalles && obra.detalles.length > 0 ? obra.detalles : (obra ? [obra.portada] : [])
    const idx = images.indexOf(lightbox)
    if (idx !== -1) {
      const prevIdx = (idx - 1 + images.length) % images.length
      setLightbox(images[prevIdx])
    }
  }

  const handleNext = () => {
    const images = obra?.detalles && obra.detalles.length > 0 ? obra.detalles : (obra ? [obra.portada] : [])
    const idx = images.indexOf(lightbox)
    if (idx !== -1) {
      const nextIdx = (idx + 1) % images.length
      setLightbox(images[nextIdx])
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox) return
      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'Escape') {
        setLightbox(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightbox, obra])

  if (!obra) {
    return (
      <PageTransition>
        <div className={styles.notFound}>
          <p>Obra no encontrada.</p>
          <Link to="/galeria" className="btn-dark">Volver a la galería</Link>
        </div>
      </PageTransition>
    )
  }

  const idx = obras.findIndex(o => o.slug === slug)
  const prev = obras[idx - 1]
  const next = obras[idx + 1]

  return (
    <PageTransition>
      <div className={styles.page}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/galeria">Galería</Link>
          <span>/</span>
          <span>{obra.titulo}</span>
        </nav>

        <div className={styles.main}>
          {/* Imagen principal */}
          <div className={styles.imgCol}>
            <motion.img
              key={obra.portada}
              src={obra.portada}
              alt={obra.titulo}
              className={styles.mainImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => setLightbox(obra.portada)}
            />

            {/* Galería de detalles */}
            {obra.detalles && obra.detalles.length > 0 && (
              <div className={styles.detailGrid}>
                {obra.detalles.filter(src => src !== obra.portada).map((src, i) => (
                  <motion.img
                    key={src}
                    src={src}
                    alt={`${obra.titulo} — detalle ${i + 2}`}
                    loading="lazy"
                    className={styles.detailImg}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setLightbox(src)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <aside className={styles.infoCol}>
            <p className="sec-eyebrow">{obra.tecnica}</p>
            <h1 className={styles.titulo}>{obra.titulo}</h1>

            <div className={styles.statusBadge} data-status={obra.status}>
              {obra.status === 'disp' ? 'Disponible' : 'Vendido'}
            </div>

            <div className={styles.tags}>
              {obra.tags.map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>

            <div className={styles.sep} />

            <p className={styles.desc}>{obra.descripcion}</p>

            {obra.status === 'disp' && (
              <Link
                to="/contacto"
                className={`btn-dark ${styles.ctaBtn}`}
              >
                Preguntar por esta obra
              </Link>
            )}

            <Link to="/encargos" className={`btn-outline ${styles.encLink}`}>
              ¿Quieres un encargo similar?
            </Link>
          </aside>
        </div>

        {/* Navegación entre obras */}
        <nav className={styles.obraNav}>
          {prev ? (
            <Link to={`/obras/${prev.slug}`} className={styles.navLink}>
              ← {prev.titulo}
            </Link>
          ) : <span />}
          <Link to="/galeria" className={styles.navCenter}>Galería</Link>
          {next ? (
            <Link to={`/obras/${next.slug}`} className={styles.navLink}>
              {next.titulo} →
            </Link>
          ) : <span />}
        </nav>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className={styles.lb}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button className={styles.lbClose} onClick={() => setLightbox(null)}>
              Cerrar ✕
            </button>
            
            {obra.detalles && obra.detalles.length > 1 && (
              <>
                <button 
                  className={styles.lbPrev} 
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
                <button 
                  className={styles.lbNext} 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  aria-label="Siguiente imagen"
                >
                  ›
                </button>
              </>
            )}

            <motion.img
              src={lightbox}
              alt={obra.titulo}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
