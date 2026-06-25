import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import ObraCard from '../components/ObraCard'
import { obras } from '../data/obras'
import styles from './Home.module.css'
import { getAssetUrl } from '../utils/paths'

const featured = obras.filter(o =>
  ['irrupcion', 'olas-de-lava', 'margenes-de-nieve', 'marismas', 'horizonte-dorado', 'estratos-de-arena'].includes(o.slug)
)

export default function Home() {
  return (
    <PageTransition>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.eyebrow}>Pintora · Madrid · Acrílico y acuarela</p>
          <h1 className={styles.title}>
            Carolina<br />Peñacoba
          </h1>
          <div className={styles.line} />
          <p className={styles.sub}>
            Obra original en acrílico con texturas. Paisajes abstractos que capturan
            la materia, la luz y el silencio del territorio.
          </p>
          <div className={styles.actions}>
            <Link to="/galeria" className="btn-dark">Ver la obra</Link>
            <Link to="/encargos" className="btn-outline">Pedir un encargo</Link>
          </div>
        </div>
        <motion.div
          className={styles.heroRight}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.img
            src={getAssetUrl('/images/obras/irrupcion/detalles/1.avif')}
            alt="Irrupción — Carolina Peñacoba"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.8 }}
          />
          <div className={styles.caption}>
            <div className={styles.captionTitle}>Irrupción</div>
            <div className={styles.captionSub}>Acrílico con texturas · Disponible</div>
          </div>
        </motion.div>
      </section>



      {/* ── GALERÍA DESTACADA ── */}
      <section className={styles.gallery}>
        <div className={styles.secHeader}>
          <div>
            <p className="sec-eyebrow">Obra</p>
            <h2 className="sec-title">Galería</h2>
          </div>
          <Link to="/galeria" className="btn-outline">Ver todo →</Link>
        </div>

        <div className={styles.editorialGrid}>
          {/* Fila A: grande + 2 apiladas */}
          <div className={styles.rowA}>
            <ObraCard obra={obras.find(o => o.slug === 'olas-de-lava')} size="big" />
            <div className={styles.colStack}>
              <ObraCard obra={obras.find(o => o.slug === 'margenes-de-nieve')} size="land" />
              <ObraCard obra={obras.find(o => o.slug === 'marismas')} size="land" />
            </div>
          </div>

          {/* Fila B: tres iguales */}
          <div className={styles.rowB}>
            <ObraCard obra={obras.find(o => o.slug === 'horizonte-dorado')} size="sq" />
            <ObraCard obra={obras.find(o => o.slug === 'estratos-de-arena')} size="sq" />
            <ObraCard obra={obras.find(o => o.slug === 'orillas')} size="sq" />
          </div>

          {/* Fila C: central protagonista */}
          <div className={styles.rowD}>
            <ObraCard obra={obras.find(o => o.slug === 'rompiente-sur')} size="sq" />
            <ObraCard obra={obras.find(o => o.slug === 'irrupcion')} size="tall" />
            <ObraCard obra={obras.find(o => o.slug === 'mar-en-dos-tiempos')} size="sq" />
          </div>

          {/* Fila D: dos anchas */}
          <div className={styles.rowC}>
            <ObraCard obra={obras.find(o => o.slug === 'tramontana')} size="land" />
            <ObraCard obra={obras.find(o => o.slug === 'reflejos')} size="land" />
          </div>
        </div>

        <div className={styles.galleryMore}>
          <Link to="/galeria" className="btn-outline">Ver catálogo completo →</Link>
        </div>
      </section>

      {/* ── SOBRE MÍ ── */}
      <section className={styles.sobre}>
        <div className={styles.sobreGrid}>
          <div className={styles.sobreImgWrap}>
            <img
              src={getAssetUrl('/images/obras/margenes-de-nieve/detalles/1.avif')}
              alt="Carolina Peñacoba — detalle de obra en el estudio"
            />
            <div className={styles.sobreAccent} />
          </div>
          <div>
            <p className="sec-eyebrow">La artista</p>
            <h2 className="sec-title" style={{ marginBottom: '1.8rem' }}>Sobre mí</h2>
            <p className={styles.sobreIntro}>
              Pinto lo que el territorio deja en la memoria: la textura del agua, la
              densidad del silencio, la piel cambiante de la tierra.
            </p>
            <div className={styles.sobreBody}>
              <p>
                Trabajo con acrílico y técnicas mixtas de textura, buscando capas que
                tengan peso físico y no solo visual. Cada obra nace de una observación
                pausada: costas, marismas, horizontes, estratos geológicos.
              </p>
              <p>
                También pinto en acuarela cuando el motivo pide ligereza y transparencia.
                Las dos técnicas conviven en mi estudio de Madrid como dos formas distintas
                de escuchar al mismo paisaje.
              </p>
            </div>
            <div className={styles.pills}>
              {['Acrílico con textura', 'Acuarela', 'Técnica mixta', 'Encargos', 'Madrid'].map((t, i) => (
                <span key={t} className={`${styles.pill} ${i < 2 ? styles.pillHi : ''}`}>{t}</span>
              ))}
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Link to="/sobre" className="btn-outline">Leer más →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENCARGOS CTA ── */}
      <section className={styles.enc}>
        <div className={styles.encInner}>
          <p className="sec-eyebrow">Encargos</p>
          <h2 className={styles.encTitle}>
            ¿Tienes en mente<br />una <em>obra propia</em>?
          </h2>
          <p className={styles.encSub}>
            Creo piezas a medida: el espacio, los colores, el formato, el ritmo.
            Me cuentas la idea y yo propongo el camino. Sin compromiso.
          </p>
          <Link to="/encargos" className="btn-dark">Saber más</Link>
        </div>
      </section>
    </PageTransition>
  )
}
