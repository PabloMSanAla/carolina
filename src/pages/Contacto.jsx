import { useState } from 'react'
import PageTransition from '../components/PageTransition'
import styles from './Contacto.module.css'

export default function Contacto() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', mensaje: '' })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      const response = await fetch('https://formsubmit.co/ajax/estudiodecarolina@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nombre: `${form.nombre} ${form.apellido}`,
          Email: form.email,
          Mensaje: form.mensaje
        })
      })
      if (response.ok) {
        setSent(true)
      } else {
        setError(true)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
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
                {error && (
                  <p className={styles.errorMsg}>
                    Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo o escríbeme directamente por email.
                  </p>
                )}
                <button type="submit" className="btn-dark" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
