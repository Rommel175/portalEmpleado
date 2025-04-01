import styles from './reportesCard.module.css'
import ReportesCardDate from './ReportesCardDate'
import ReportesCardHeader from './ReportesCardHeader'

export default function ReportesCard() {
  return (
    <div className={styles.card}>
        <ReportesCardHeader />

        <ReportesCardDate />

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