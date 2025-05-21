import styles from './incidenciasCard.module.css'
import IncidenciasCardDate from './IncidenciasCardDate'
import IncidenciasCardHeader from './IncidenciasCardHeader'

export default function IncidenciasCard({image, nombre, apellido, email, created_at, evento, fecha_original, fecha_solicitada, motivo}: {image: string, nombre: string, apellido: string, email: string, created_at: Date, evento: string, fecha_original: Date, fecha_solicitada: Date, motivo: string}) {
  return (
    <div className={styles.card}>
        <IncidenciasCardHeader image={image} nombre={nombre} apellido={apellido} email={email} created_at={created_at} />

        <IncidenciasCardDate evento={evento} fecha_original={fecha_original} fecha_solicitada={fecha_solicitada} />

        <div className={styles.message}>
          <p>{motivo}</p>
        </div>

        <div className={styles.buttons}>
          <button>Denegar</button>
          <button>Aceptar</button>
        </div>
    </div>
  );
}