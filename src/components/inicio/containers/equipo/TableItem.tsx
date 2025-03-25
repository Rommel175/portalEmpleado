import styles from './tableItem.module.css'
import Image from 'next/image';

type Prop = {
    name: string,
    email: string,
    foto?: string,
    estado?: 'Activo' | 'Inactivo' | 'Pausa',
    localizacion?: 'Oficina' | 'Casa' | 'Viaje',
    inicio?: string,
    final?: string
}

export default function TableItem( {name, email, foto, estado='Inactivo', localizacion, inicio="-", final="-"}: Prop ) {

    return (
        <div className={styles.items}>
            <div className={styles.usuario}>
                <Image src={foto ?? "https://clasicoshispanicos.com/wp-content/uploads/2021/01/siluetagrisanonimo.jpg"} width={40} height={40} alt='img_profile' />
                <div className={styles.personalInfo}>
                    <h2>{name}</h2>
                    <h4>{email}</h4>
                </div>
            </div>

            <div className={`${(estado == 'Activo') && styles.estadoActivo} ${(estado == 'Inactivo') && styles.estadoInactivo} ${(estado == 'Pausa') && styles.estadoPausa}`}>
                <h2>{estado ?? 'Inactivo'}</h2>
            </div>

            <div className={styles.localizacion}>
                <h2>{localizacion ?? 'No especificado'}</h2>
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