import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import styles from './SobreMi.module.css'
import { getAssetUrl } from '../utils/paths'

export default function SobreMi() {
  return (
    <PageTransition>
      <div className={styles.page}>
        <div className={styles.grid}>
          <div className={styles.imgWrap}>
            <img
              src={getAssetUrl('/images/obras/Carolina_portrait.png')}
              alt="Carolina Peñacoba — artista"
            />
            <div className={styles.accent} />
          </div>

          <div className={styles.content}>
            <p className="sec-eyebrow">La artista</p>
            <h1 className="sec-title" style={{ marginBottom: '1.8rem' }}>Sobre mí</h1>

            <p className={styles.intro}>
              Decir algo sobre uno mismo siempre es difícil. No es sencillo encontrar
              el equilibrio entre el currículum y la esencia de la persona, en su justa medida.
            </p>

            <div className={styles.body}>
              <p>
                Decir que soy hija de Madrid es un buen comienzo, aunque ahora me haya refugiado
                en su sierra. También que, desde muy joven, los trazos, las luces y los colores
                han formado parte de mis intereses; que, por distintos motivos, terminé estudiando
                Magisterio, pero que seguí buscando mi parte creativa cuando comencé los estudios
                de Diseño de Interiores, y que disfruté especialmente al entrar en la Facultad de
                Bellas Artes.
              </p>
              <p>
                La vida se ha comportado conmigo de una forma entretenida y caprichosa, regalándome
                distintos giros de guion, mientras yo entraba y salía del mundo de la pintura.
              </p>
              <p>
                Ahora, con los deberes hechos, he encontrado el espacio y el tiempo para profundizar
                en mi faceta creativa. Y aquí estoy, disfrutando de las texturas, de la luz, de los
                colores, incluso del olor.
              </p>
              <p>
                Me gusta saber encontrar los pequeños placeres de la vida, esos que se esconden entre
                las prisas y la costumbre: la luz y los colores del atardecer, el crepitar de las
                llamas, el sonido de los pasos sobre las hojas, el murmullo de la lluvia, la fuerza
                sobrecogedora del mar, el olor de las pinturas… Me obligo a buscarlos y a disfrutarlos.
                No quiero vivir solo de los grandes momentos; quiero vivirlos todos.
              </p>
            </div>

            <div className={styles.pills}>
              {['Acrílico con textura', 'Acuarela', 'Técnica mixta', 'Encargos', 'Madrid'].map((t, i) => (
                <span key={t} className={`${styles.pill} ${i < 2 ? styles.pillHi : ''}`}>{t}</span>
              ))}
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.2rem' }}>
              <Link to="/galeria" className="btn-dark">Ver la obra</Link>
              <Link to="/contacto" className="btn-outline">Contacto</Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
