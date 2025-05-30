import TooltipUserInfo from '@/components/tooltip/TooltipUserInfo';
import styles from './tableItem.module.css'
import Image from 'next/image';
import Tooltips2 from '@/components/tooltip/Tooltips2';

type Prop = {
    nombre: string,
    apellido?: string,
    email: string,
    foto?: string,
    estado?: string,
    localizacion?: string,
    inicio?: string,
    final?: string,
    id: string
}

export default function TableItem({ nombre, apellido, email, foto, estado = 'Jornada Finalizada', localizacion, inicio = "-", final = "-", id }: Prop) {

    return (
        <div className={styles.items}>

            <TooltipUserInfo id={id}>
                <div className={styles.usuario}>
                    <Image src={foto ?? "/images/default.jpg"} width={40} height={40} alt='img_profile' />
                    <div className={styles.personalInfo}>
                        <div className={styles.name}>
                            <h2>{nombre} {apellido}</h2>
                            <Tooltips2 infoText='Ver usuario' place='top'>
                                <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.60176 8.38657L6.41431 5.57402L3.60176 2.76148" stroke="#333333" strokeWidth="0.623087" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Tooltips2>
                        </div>

                        <h4>{email}</h4>
                    </div>
                </div>
            </TooltipUserInfo>

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
        </div>
    );
}