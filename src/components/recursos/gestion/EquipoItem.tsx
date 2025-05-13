import Link from 'next/link';
import styles from './equipoItem.module.css'
import Image from 'next/image';

type Prop = {
    id: string,
    nombre: string,
    apellido?: string,
    email: string,
    foto?: string,
    estado?: string,
    localizacion?: string,
    inicio?: string,
    final?: string
}

export default function EquipoItem({ id, nombre, apellido, email, foto, estado = 'Jornada Finalizada', localizacion, inicio = "-", final = "-" }: Prop) {

    return (
        <div className={styles.item}>
            <div className={styles.usuario}>
                <Image src={foto || ''} width={40} height={40} alt='img_profile' />
                <div className={styles.personalInfo}>
                    <div className={styles.name}>
                        <h2>{nombre} {apellido}</h2>
                    </div>
                    <h4>{email}</h4>
                </div>
            </div>

            <div className={styles.estado}>
                {
                    (estado == 'Activo') && (
                        <div className={styles.estadoActivo}>
                            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3.5" cy="3.5" r="3" fill="#0DC44A" />
                            </svg>
                            <h2>
                                {estado}
                            </h2>
                        </div>
                    )
                }

                {
                    (estado == 'Inactivo') && (
                        <div className={styles.estadoInactivo}>
                            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3.5" cy="3.5" r="3" fill="#E94544" />
                            </svg>
                            <h2>
                                {estado}
                            </h2>
                        </div>
                    )
                }

                {
                    (estado == 'Pausa') && (
                        <div className={styles.estadoPausa}>
                            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3.5" cy="3.5" r="3" fill="#FF6E00" />
                            </svg>
                            <h2>
                                {estado}
                            </h2>
                        </div>
                    )
                }

                {
                    (estado == 'Jornada Finalizada') && (
                        <div className={styles.estadoFinJornada}>
                            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3.5" cy="3.5" r="3" fill="#828282" />
                            </svg>
                            <h2>
                                {estado}
                            </h2>
                        </div>
                    )
                }

                {
                    (estado == 'Vacaciones') && (
                        <div className={styles.estadoVacaciones}>
                            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="3.5" cy="3.5" r="3" fill="#4DD4EC" />
                            </svg>
                            <h2>
                                {estado}
                            </h2>
                        </div>
                    )
                }
            </div>


            <div className={styles.localizacion}>
                <h2>{localizacion ?? '-'}</h2>
            </div>

            <div className={styles.jornada}>
                <h2>{inicio}</h2>
            </div>

            <div className={styles.jornada}>
                <h2>{final}</h2>
            </div>

            <Link href={`/dashboard/editar_perfil/${id}`} className={styles.verUsuario}>
                Ver usuario
                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.14807 9.98161L7.85178 6.64827L4.14807 3.31494" stroke="#285FF5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    );
}