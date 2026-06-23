import { useState } from 'react'
import PageTransition from '../components/PageTransition'
import styles from './Contacto.module.css'

export default function Contacto() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', mensaje: '' })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    // mailto fallback — replace with your backend/Formspree endpoint as needed
    const subject = encodeURIComponent('Consulta desde la web')
    const body = encodeURIComponent(
      `Nombre: ${form.nombre} ${form.apellido}\nEmail: ${form.email}\n\n${form.mensaje}`
    )
    window.location.href = `mailto:estudiodecarolina@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <PageTransition>
      <div className={styles.page}>
        <div className={styles.grid}>
          <div className={styles.info}>
            <p className="sec-eyebrow">Encarga tu obra</p>
            <h1 className="sec-title" style={{ marginBottom: '1.5rem' }}>¡Escríbeme!</h1>
            <p className={styles.infoText}>
              Si estás pensando en encargar un cuadro, ya sea para ti o para un regalo,
              seguramente te asalten muchas dudas: ¿de qué tamaño? ¿un lienzo o un tríptico?
              ¿vertical o apaisado? ¿qué colores combinarán mejor con el salón?
            </p>
            <p className={styles.infoText}>¡Escríbeme y hablamos!</p>

            <div className={styles.contactData}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Email</span>
                <a href="mailto:estudiodecarolina@gmail.com">estudiodecarolina@gmail.com</a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Instagram</span>
                <a href="https://www.instagram.com/carolinapenacoba" target="_blank" rel="noreferrer">
                  @carolinapenacoba
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Ubicación</span>
                <span>Avenida de Sierra Nevada · 28729 Cotos de Monterrey, Madrid</span>
              </div>
            </div>
          </div>

          <div className={styles.formWrap}>
            {sent ? (
              <div className={styles.thanks}>
                <p>¡Gracias por tu mensaje! Te responderé pronto.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="nombre">Nombre *</label>
                    <input
                      id="nombre" name="nombre" type="text" required
                      value={form.nombre} onChange={handleChange}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="apellido">Apellido *</label>
                    <input
                      id="apellido" name="apellido" type="text" required
                      value={form.apellido} onChange={handleChange}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email" name="email" type="email" required
                    value={form.email} onChange={handleChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="mensaje">Tu idea o consulta *</label>
                  <textarea
                    id="mensaje" name="mensaje" rows={6} required
                    value={form.mensaje} onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn-dark">Enviar</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
