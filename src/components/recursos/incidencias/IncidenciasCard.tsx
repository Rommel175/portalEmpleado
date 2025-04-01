import styles from './incidenciasCard.module.css'
import IncidenciasCardDate from './IncidenciasCardDate'
import IncidenciasCardHeader from './IncidenciasCardHeader'

export default function IncidenciasCard() {
  return (
    <div className={styles.card}>
        <IncidenciasCardHeader />

        <IncidenciasCardDate />

        <div className={styles.message}>
          <p>Hola, Se me pasó fichar la entrada después de comer, pero retomé a la hora de siempre. ¿Pueden ayudarme a corregirlo? ¡Gracias!</p>
        </div>

        <div className={styles.buttons}>
          <button>Denegar</button>
          <button>Aceptar</button>
        </div>
    </div>
  );
}