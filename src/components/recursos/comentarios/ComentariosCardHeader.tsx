import styles from './comentariosCardHeader.module.css';
import Image from 'next/image';

export default function ComentariosCardHeader( {nombre, apellido, email, image} : { nombre: string, apellido: string, email: string, image: string } ) {
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
            <p>hace 2 horas</p>
        </div>
    );
}