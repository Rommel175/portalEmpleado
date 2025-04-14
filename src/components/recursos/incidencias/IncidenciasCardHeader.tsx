import styles from './incidenciasCardHeader.module.css'
import Image from 'next/image';

export default function IncidenciasCardHeader() {
    return (
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
    );
}