import styles from './incidencias.module.css'
import ContainerHeader from '@/components/containers/ContainerHeader'
import Image from 'next/image';

export default function Incidencias() {
  return (
    <div className={styles.container}>
      <ContainerHeader name='Reportes' />
      <div className={styles.content}>

        <div className={styles.headerCard}>
          <div>
            <div className={styles.personalInfo}>
              <Image src={'https://lh3.googleusercontent.com/a/ACg8ocLM80DGO-2W6Ou8eM4Pl4BEj6insLI3HZt1ce3XyRk0Rd3cVQ=s96-c'} alt='avatar' width={40} height={40} />
              <div>
                <h2>Jane Cooper</h2>
                <h3>jane.cooper@example.com</h3>
              </div>
            </div>
            <p>Ha solicitado una modificación de la jornada laboral</p>
          </div>
          <p>hace 2 horas</p>
        </div>

        <div className={styles.date}>

          <div className={styles.dateItem}>
            <h4>Fecha actual</h4>
            <div className={styles.dateItemContent}>
              <h3>Entrada</h3>
              <div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.00038 13.5386C11.0592 13.5386 13.5388 11.0589 13.5388 8.00013C13.5388 4.94132 11.0592 2.46167 8.00038 2.46167C4.94157 2.46167 2.46191 4.94132 2.46191 8.00013C2.46191 11.0589 4.94157 13.5386 8.00038 13.5386Z" stroke="#7B8794" strokeWidth="0.92694" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.38501 5.53809V8.61501H10.4619" stroke="#7B8794" strokeWidth="0.92694" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>09 de marzo de 2025, 16:20 </p>
              </div>
            </div>
          </div>

          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.375 9H14.625M14.625 9L10.4062 4.5M14.625 9L10.4062 13.5" stroke="#C0C0C0" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className={styles.dateItem}>
            <h4>Petición</h4>
            <div className={styles.dateItemContent}>
              <h3>Entrada</h3>
              <div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.00038 13.5386C11.0592 13.5386 13.5388 11.0589 13.5388 8.00013C13.5388 4.94132 11.0592 2.46167 8.00038 2.46167C4.94157 2.46167 2.46191 4.94132 2.46191 8.00013C2.46191 11.0589 4.94157 13.5386 8.00038 13.5386Z" stroke="#7B8794" strokeWidth="0.92694" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.38501 5.53809V8.61501H10.4619" stroke="#7B8794" strokeWidth="0.92694" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p>09 de marzo de 2025, 16:20 </p>
              </div>
            </div>
          </div>

        </div>

        <div className={styles.message}>
          <p>Hola, Se me pasó fichar la entrada después de comer, pero retomé a la hora de siempre. ¿Pueden ayudarme a corregirlo? ¡Gracias!</p>
        </div>

        <div className={styles.buttons}>
          <button>Denegar</button>
          <button>Aceptar</button>
        </div>

      </div>
    </div>
  );
}