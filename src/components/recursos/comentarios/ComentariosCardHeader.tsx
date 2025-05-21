import styles from './comentariosCardHeader.module.css';
import Image from 'next/image';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

dayjs.extend(relativeTime);
dayjs.locale('es');

export default function ComentariosCardHeader( {nombre, apellido, email, image, date} : { nombre: string, apellido: string, email: string, image: string, date: Date } ) {
    return (
        <div className={styles.headerCard}>
            <div>
                <div className={styles.personalInfo}>
                    <Image src={image} alt='avatar' width={40} height={40} />
                    <div>
                        <h2>{nombre || ''} {apellido || ''}</h2>
                        <h3>{email}</h3>
                    </div>
                </div>
            </div>
            <p>{dayjs(date).fromNow()}</p>
        </div>
    );
}