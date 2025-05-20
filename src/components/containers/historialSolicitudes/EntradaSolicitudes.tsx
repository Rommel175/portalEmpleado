import dayjs from 'dayjs';
import 'dayjs/locale/es';
import styles from './entradaSolicitudes.module.css'

export default function EntradaSolicitudes( {created_at, fecha_original, fecha_solicitada, evento, motivo} : {created_at: Date, fecha_original: Date, fecha_solicitada: Date, evento: string, motivo: string} ) {
  return (
    <div className={styles.container}>
      <header className={styles.headerEntradas}>
        <div>
          <h3>{evento}</h3>
          <h3>{dayjs(fecha_original).format('DD [de] MMMM [de] YYYY')}</h3>
          <div className={styles.date}>
            <h3>{dayjs(fecha_original).format('HH:mm:ss')}</h3>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.375 9H14.625M14.625 9L10.4062 4.5M14.625 9L10.4062 13.5" stroke="#C0C0C0" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3>{dayjs(fecha_solicitada).format('HH:mm:ss')}</h3>
          </div>
        </div>
        <h3>{dayjs(created_at).format('D MMM YYYY, HH:mm')}</h3>
      </header>
      <div className={styles.message}>
        <p>{motivo}</p>
      </div>
    </div>
  );
}