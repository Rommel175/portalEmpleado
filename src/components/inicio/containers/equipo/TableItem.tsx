import styles from './tableItem.module.css'
import Image from 'next/image';

type Prop = {
    name?: string,
    email?: string,
    foto?: string,
    estado?: string,
    localizacion?: string,
    inicio?: string,
    final?: string
}

export default function TableItem( {name, email, foto ,estado, localizacion, inicio, final}: Prop ) {
    return (
        <div className={styles.items}>
            <div className={styles.usuario}>
                <Image src={foto ?? "https://clasicoshispanicos.com/wp-content/uploads/2021/01/siluetagrisanonimo.jpg"} width={40} height={40} alt='img_profile' />
                <div className={styles.personalInfo}>
                    <h2>{name}</h2>
                    <h4>{email}</h4>
                </div>
            </div>

            <div className={styles.estadoActivo}>
                <h2>{estado}</h2>
            </div>

            <div className={styles.localizacion}>
                <h2>{localizacion}</h2>
            </div>

            <div className={styles.jornada}>
                <h2>{inicio}</h2>
            </div>

            <div className={styles.jornada}>
                <h2>{final}</h2>
            </div>
        </div>
    );
}