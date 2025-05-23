'use client'

import { useEffect, useState } from 'react';
import styles from './buttonModificar.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import SnackbarSuccess from '@/components/snackbar/solicitudes/success/SnackbarSuccess';
import SnackbarError from '@/components/snackbar/solicitudes/error/SnackbarError';

type Prop = {
    hour: Date,
    date: string,
    id: number,
    action: string
}

export default function ButtonModificar({ hour, date, id, action }: Prop) {
    const [isOpen, setIsOpen] = useState(false);
    const [horaSolicitada, setHoraSolicitada] = useState({
        value: '',
        hasError: false
    });
    const [motivo, setMotivo] = useState('');

    //snackbars
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarError, setSnackbarError] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (snackbarSuccess) {
            const timer = setTimeout(() => {
                setSnackbarSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbarSuccess]);

    useEffect(() => {
        if (snackbarError) {
            const timer = setTimeout(() => {
                setSnackbarError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbarError]);

    const hourRegexp = new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/);

    function handleOpen() {
        setIsOpen(true);
    }

    function handleClose() {
        setIsOpen(false);
    }

    function handleChangeMotivo(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setMotivo(e.target.value)
    }

    function handleChangeHoraSolicitada(e: React.ChangeEvent<HTMLInputElement>) {
        setHoraSolicitada({ ...horaSolicitada, value: e.target.value });
    }

    function handleBlurHoraSolicitada() {
        const hasError = !hourRegexp.test(horaSolicitada.value);
        setHoraSolicitada((prev) => ({ ...prev, hasError }))
    }

    async function enviarSolicitud() {
        const res = await fetch('/api/solicitudes/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fichaje_evento_id: id,
                fecha_original: hour,
                fecha_solicitada: horaSolicitada.value,
                evento: action,
                motivo: motivo
            })
        })

        if (!res.ok) {
            console.error('Error en la respuesta:', res.status);
            setSnackbarError(true);
            setMessage('Tu solicitud de modificación no ha sido enviada correctamente.')
            return;
        }

        const result = await res.json();

        if (result.success) {
            setSnackbarSuccess(true);
            setMessage('Tu solicitud de modificación ha sido enviada correctamente.');
        }
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const isHoraValida = hourRegexp.test(horaSolicitada.value);

        if (!isHoraValida) {
            setHoraSolicitada((prev) => ({ ...prev, hasError: true }));
            return;
        }
        
        setIsOpen(false);
        enviarSolicitud();
    }

    return (
        <>
            {
                (snackbarSuccess) &&
                <SnackbarSuccess setSnackbarSuccess={setSnackbarSuccess} message={message} />
            }

            {
                (snackbarError) &&
                <SnackbarError setSnackbarError={setSnackbarError} message={message} />
            }

            <div className={styles.modificacion} onClick={handleOpen}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.3983 2.44578C11.0795 2.11111 10.6472 1.9231 10.1963 1.9231C9.74553 1.9231 9.31317 2.11111 8.99438 2.44578L2.98261 8.75889C2.80729 8.94284 2.68633 9.17607 2.63427 9.4305L2.17087 11.7008C2.15865 11.7604 2.16085 11.8223 2.17728 11.8808C2.19371 11.9393 2.22383 11.9926 2.26491 12.0357C2.30598 12.0788 2.3567 12.1105 2.41241 12.1277C2.46813 12.145 2.52708 12.1473 2.58386 12.1344L4.7462 11.6479C4.98852 11.5932 5.21065 11.4662 5.38586 11.2822L11.3983 4.96942C11.717 4.63471 11.896 4.18084 11.896 3.7076C11.896 3.23436 11.717 2.78049 11.3983 2.44578ZM9.48629 2.9619C9.67638 2.77315 9.92909 2.66971 10.1907 2.67356C10.4523 2.67741 10.7021 2.78825 10.8871 2.98251C11.0721 3.17677 11.1776 3.43913 11.1812 3.71379C11.1848 3.98846 11.0862 4.25377 10.9064 4.4533L10.5935 4.78181L9.17306 3.29076L9.48629 2.9619ZM8.68115 3.80688L10.1016 5.29829L4.89464 10.7664C4.81407 10.851 4.71193 10.9093 4.60053 10.9343L2.96279 11.303L3.31391 9.5838C3.33776 9.46684 3.39329 9.3596 3.47383 9.275L8.68115 3.80688Z" fill="#285FF5" />
                </svg>
                <p>Solicitar modificacion</p>
            </div>

            {
                (isOpen) && (
                    <div className={styles.overlay}>
                        <form className={styles.modalContainer} onSubmit={handleSubmit}>
                            <svg onClick={handleClose} className={styles.svgModal} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.181 10.8737L14.3292 15.0219C14.4675 15.1555 14.6528 15.2294 14.845 15.2278C15.0373 15.2261 15.2212 15.149 15.3572 15.013C15.4932 14.877 15.5703 14.6931 15.5719 14.5009C15.5736 14.3086 15.4997 14.1234 15.3661 13.9851L11.2179 9.83679L15.3661 5.68853C15.4997 5.55023 15.5736 5.36499 15.5719 5.17273C15.5703 4.98046 15.4932 4.79654 15.3572 4.66058C15.2212 4.52462 15.0373 4.4475 14.845 4.44583C14.6528 4.44416 14.4675 4.51807 14.3292 4.65165L10.181 8.79991L6.03272 4.65165C5.8938 4.52137 5.70964 4.45026 5.51922 4.45335C5.32879 4.45644 5.14704 4.5335 5.01242 4.66821C4.8778 4.80293 4.80087 4.98474 4.79791 5.17516C4.79496 5.36559 4.8662 5.5497 4.99657 5.68853L9.1441 9.83679L4.99584 13.9851C4.9258 14.0527 4.86994 14.1336 4.83151 14.2231C4.79308 14.3125 4.77285 14.4088 4.772 14.5061C4.77115 14.6035 4.78971 14.7001 4.82658 14.7902C4.86345 14.8803 4.9179 14.9622 4.98675 15.031C5.0556 15.0999 5.13748 15.1543 5.2276 15.1912C5.31771 15.2281 5.41427 15.2466 5.51164 15.2458C5.60901 15.2449 5.70523 15.2247 5.7947 15.1863C5.88416 15.1478 5.96508 15.092 6.03272 15.0219L10.181 10.8737Z" fill="#333333" />
                            </svg>

                            <header className={styles.title}>
                                <h2>Solicitud de modificación de la hora de entrada</h2>
                                <div>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.5 4.55556V3M6.5 4.55556V3M3.19444 6.88889H16.8056M3 8.47867C3 6.83367 3 6.01078 3.33911 5.38233C3.64575 4.82179 4.12155 4.37239 4.69867 4.09822C5.36444 3.77778 6.23556 3.77778 7.97778 3.77778H12.0222C13.7644 3.77778 14.6356 3.77778 15.3013 4.09822C15.887 4.37978 16.3622 4.82933 16.6609 5.38156C17 6.01156 17 6.83444 17 8.47944V12.2999C17 13.9449 17 14.7678 16.6609 15.3962C16.3543 15.9568 15.8784 16.4062 15.3013 16.6803C14.6356 17 13.7644 17 12.0222 17H7.97778C6.23556 17 5.36444 17 4.69867 16.6796C4.12167 16.4056 3.64588 15.9565 3.33911 15.3962C3 14.7662 3 13.9433 3 12.2983V8.47867Z" stroke="#7B8794" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <h3>{dayjs(date).format('DD [de] MMMM [de] YYYY')}</h3>
                                </div>
                            </header>

                            <div className={styles.containerHours}>
                                <div className={styles.hourItem}>
                                    <label>Hora actual</label>
                                    <input type="text" value={dayjs(hour).format('HH:mm:ss')} readOnly />
                                </div>

                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.375 9H14.625M14.625 9L10.4062 4.5M14.625 9L10.4062 13.5" stroke="#C0C0C0" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <div className={styles.hourItem}>
                                    <label>Petición</label>
                                    <input type="text" placeholder='Escribe aquí la hora, ej: 19:00' value={horaSolicitada.value} onChange={handleChangeHoraSolicitada} onBlur={handleBlurHoraSolicitada} />

                                    {
                                        (horaSolicitada.hasError) &&
                                        <span style={{ color: 'red' }}>No es una hora válida</span>
                                    }

                                </div>
                            </div>

                            <div className={styles.messageContainer}>
                                <label>Mensaje</label>
                                <textarea name="message" id="message" placeholder='Escribe aquí tu texto' value={motivo} onChange={handleChangeMotivo}></textarea>
                            </div>

                            <div className={styles.buttons}>
                                <button onClick={handleClose} className={styles.cancel}>Cancelar</button>
                                <input type="submit" value="Enviar" className={styles.send} />
                            </div>

                        </form>
                    </div>
                )
            }
        </>
    );
}
