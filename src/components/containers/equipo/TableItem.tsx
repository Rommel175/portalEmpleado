import styles from './tableItem.module.css'
import Image from 'next/image';

type Prop = {
    name: string,
    email: string,
    foto?: string,
    estado?: 'Activo' | 'Inactivo' | 'Pausa' | 'Jornada Finalizada' | 'Vacaciones',
    localizacion?: 'Oficina' | 'Casa' | 'Viaje',
    inicio?: string,
    final?: string
}

export default function TableItem({ name, email, foto, estado = 'Jornada Finalizada', localizacion, inicio = "-", final = "-" }: Prop) {

    return (
        <div className={styles.items}>
            <div className={styles.usuario}>
                <Image src={foto ?? "https://clasicoshispanicos.com/wp-content/uploads/2021/01/siluetagrisanonimo.jpg"} width={40} height={40} alt='img_profile' />
                <div className={styles.personalInfo}>
                    <div className={styles.name}>
                        <h2>{name}</h2>
                        <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.60176 8.38657L6.41431 5.57402L3.60176 2.76148" stroke="#333333" strokeWidth="0.623087" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h4>{email}</h4>
                </div>
            </div>

            <div className={styles.estado}>
                <div className={`${(estado == 'Activo') && styles.estadoActivo} ${(estado == 'Inactivo') && styles.estadoInactivo} ${(estado == 'Pausa') && styles.estadoPausa} ${(estado == 'Jornada Finalizada') && styles.estadoFinJornada} ${(estado == 'Vacaciones') && styles.estadoVacaciones}`}>
                    <h2>{estado ?? 'Inactivo'}</h2>
                </div>
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