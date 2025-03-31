'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './buttonModificar.module.css'

type Prop = {
    hour: string,
    date: string
}

export default function ButtonModificar({ hour, date }: Prop) {
    const { register } = useForm();
    const [isOpen, setIsOpen] = useState(false);

    function handleOpen() {
        setIsOpen(true);
    }

    function handleClose() {
        setIsOpen(false);
    }


    return (
        <>
            <div className={styles.modificacion} onClick={handleOpen}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.3983 2.44578C11.0795 2.11111 10.6472 1.9231 10.1963 1.9231C9.74553 1.9231 9.31317 2.11111 8.99438 2.44578L2.98261 8.75889C2.80729 8.94284 2.68633 9.17607 2.63427 9.4305L2.17087 11.7008C2.15865 11.7604 2.16085 11.8223 2.17728 11.8808C2.19371 11.9393 2.22383 11.9926 2.26491 12.0357C2.30598 12.0788 2.3567 12.1105 2.41241 12.1277C2.46813 12.145 2.52708 12.1473 2.58386 12.1344L4.7462 11.6479C4.98852 11.5932 5.21065 11.4662 5.38586 11.2822L11.3983 4.96942C11.717 4.63471 11.896 4.18084 11.896 3.7076C11.896 3.23436 11.717 2.78049 11.3983 2.44578ZM9.48629 2.9619C9.67638 2.77315 9.92909 2.66971 10.1907 2.67356C10.4523 2.67741 10.7021 2.78825 10.8871 2.98251C11.0721 3.17677 11.1776 3.43913 11.1812 3.71379C11.1848 3.98846 11.0862 4.25377 10.9064 4.4533L10.5935 4.78181L9.17306 3.29076L9.48629 2.9619ZM8.68115 3.80688L10.1016 5.29829L4.89464 10.7664C4.81407 10.851 4.71193 10.9093 4.60053 10.9343L2.96279 11.303L3.31391 9.5838C3.33776 9.46684 3.39329 9.3596 3.47383 9.275L8.68115 3.80688Z" fill="#285FF5" />
                </svg>
                <p>Solicitar modificacion</p>
            </div>

            {
                (isOpen) && (
                    <div className={styles.overlay}>
                        <div className={styles.modalContainer}>
                            <header className={styles.title}>
                                <h2>Solicitud de modificación de hora</h2>
                                <div>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.0683 4.22716V2.86353M5.93195 4.22716V2.86353M3.03422 6.27262H14.966M2.86377 7.66625C2.86377 6.22421 2.86377 5.50284 3.16104 4.95193C3.42985 4.46055 3.84695 4.0666 4.35286 3.82625C4.9365 3.54534 5.70013 3.54534 7.22741 3.54534H10.7729C12.3001 3.54534 13.0638 3.54534 13.6474 3.82625C14.1608 4.07307 14.5774 4.46716 14.8392 4.95125C15.1365 5.50353 15.1365 6.22489 15.1365 7.66693V11.016C15.1365 12.4581 15.1365 13.1794 14.8392 13.7303C14.5704 14.2217 14.1533 14.6157 13.6474 14.856C13.0638 15.1363 12.3001 15.1363 10.7729 15.1363H7.22741C5.70013 15.1363 4.9365 15.1363 4.35286 14.8553C3.84705 14.6152 3.42996 14.2215 3.16104 13.7303C2.86377 13.1781 2.86377 12.4567 2.86377 11.0147V7.66625Z" stroke="#9CA1A6" strokeWidth="1.02273" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <h3>{date}</h3>
                                </div>
                            </header>
                            
                            <div className={styles.containerHours}>
                                <div className={styles.hourItem}>
                                    <h4>Hora actual</h4>
                                    <input type="text" value={hour} readOnly />
                                </div>

                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.375 9H14.625M14.625 9L10.4062 4.5M14.625 9L10.4062 13.5" stroke="#C0C0C0" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <div className={styles.hourItem}>
                                    <h4>Petición</h4>
                                    <input type="text" placeholder='Escribe aquí la hora, ej: 19:00' {...register('peticion', {
                                        required: {
                                            value: true,
                                            message: 'Este campo es obligatorio'
                                        },
                                        pattern: {
                                            value: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
                                            message: 'El formato debe ser HH:mm, ej: 19:00'
                                        }
                                    })} />
                                </div>

                            </div>

                            <div className={styles.messageContainer}>
                                <h3>Mensaje</h3>
                                <textarea name="message" id="message" placeholder='Escribe aquí tu texto'></textarea>
                            </div>

                            <div className={styles.buttons}>
                                <button onClick={handleClose} className={styles.cancel}>Cancelar</button>
                                <input type="submit" value="Enviar" className={styles.send}/>
                            </div>


                        </div>
                    </div>
                )
            }
        </>
    );
}