import styles from './incidenciasCardHeader.module.css'
import Image from 'next/image';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('es');

export default function IncidenciasCardHeader( {image, nombre, apellido, email, created_at}: {image: string, nombre: string, apellido: string, email: string, created_at: Date} ) {
    return (
        <div className={styles.headerCard}>
            <div>
                <div className={styles.personalInfo}>
                    {
                        image &&
                        <Image src={image} alt='avatar' width={40} height={40} />
                    }
                    
                    <div>
                        <h2>{nombre} {apellido}</h2>
                        <h3>{email}</h3>
                    </div>
                </div>
                <p>Ha solicitado una modificación de la jornada laboral</p>
            </div>
            <p>{dayjs(created_at).fromNow()}</p>
        </div>
    );
}