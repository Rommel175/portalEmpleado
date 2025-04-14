import styles from './entradaSolicitudes.module.css'

export default function EntradaSolicitudes() {
  return (
    <div className={styles.container}>
      <header className={styles.headerEntradas}>
        <div>
          <h3>Entrada</h3>
          <h3>09 de marzo de 2025</h3>
          <div className={styles.date}>
            <h3>16:20</h3>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.375 9H14.625M14.625 9L10.4062 4.5M14.625 9L10.4062 13.5" stroke="#C0C0C0" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3>15:00</h3>
          </div>
        </div>
        <h3>16 dic 2024, 11:20</h3>
      </header>
      <div className={styles.message}>
        <p>Hola, Se me pasó fichar la entrada después de comer, pero retomé a la hora de siempre. ¿Pueden ayudarme a corregirlo? ¡Gracias!</p>
      </div>
    </div>
  );
}