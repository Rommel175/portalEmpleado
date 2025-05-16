'use client'

import styles from './containerFichaje.module.css'
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Profile } from "@/types/Types";
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default function ContainerFichaje({ estado, setEstado, profile, localizacionFichaje }: { estado: string, setEstado: React.Dispatch<React.SetStateAction<string>>, profile: Profile, localizacionFichaje: string }) {

    const [isOpen, setIsOpen] = useState(false);
    const [isRunning, setRunning] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [currentDate, setCurrentDate] = useState<string>("");
    const [horaFinalAprox, setHoraFinalAprox] = useState<Date | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const localTime = localStorage.getItem('time');
        //const run = localStorage.getItem('run');

        if (localTime) {
            setTime(Number(localTime));
        }

        /*if (run === 'true') {
            setRunning(true);
        } else {
            setRunning(false);
        }*/

        dayjs.locale('es');

        const date = dayjs();

        setCurrentDate(date.format("DD MMMM YYYY"));

        const horasTrabajo = profile.horas_semana / 5;

        const horaFinal = date.add(horasTrabajo, 'hour');

        setHoraFinalAprox(horaFinal.toDate());

        const profilesRealTime = supabase
            .channel('realtime-contenedor-fichar')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
            }, (payload: RealtimePostgresChangesPayload<Profile>) => {
                switch (payload.eventType) {
                    case 'UPDATE':
                        const updatedItem = payload.new;
                        setEstado(updatedItem.estado);
                        break;
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(profilesRealTime);
        };

    }, []);

    //Acciones Modal Finalizar jornada
    function handleCloseCancel() {
        setIsOpen(false);
    }

    function handleCloseAccept() {
        setIsOpen(false);
        stopTimer();
    }

    function handleOpen() {
        setIsOpen(true)
    }

    //AL cambiar el estado fichaje realizar las accions del timer
    useEffect(() => {

        if (estado == 'Activo') {
            setRunning(true);
            localStorage.setItem('run', 'true');
        } else if (estado == 'Inactivo' || estado == 'Jornada Finalizada') {
            setRunning(false);
            setTime(0);
            localStorage.setItem('run', 'false');
            localStorage.setItem('time', '0');
        } else if (estado === 'Pausa') {
            setRunning(false);
            localStorage.setItem('run', 'false');
        }

    }, [estado])

    //Establecer a Activo 
    async function activo() {
        const res = await fetch('/api/timer/iniciar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profileId: profile.id,
                horaFinalAprox,
                localizacion: localizacionFichaje
            })
        });

        const result = await res.json();

        if (result && result.estado) {
            setEstado(result.estado);
        } else {
            console.error("Error al activar el timer:", result.error);
        }
    };

    function startTimer() {
        activo();
        localStorage.setItem('run', 'true');
    }

    //Establecr a pausa 
    async function pausa() {
        const res = await fetch('/api/timer/pausar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profileId: profile.id,
                localizacion: localizacionFichaje
            })
        });

        const result = await res.json();

        if (result && result.estado) {
            setEstado(result.estado);
        } else {
            console.error("Error al pausar el timer:", result.error);
        }
    }

    function pauseTimer() {
        pausa();
        localStorage.setItem('run', 'false');
    }

    //Reanudar jornada
    async function reanudar() {
        const res = await fetch('/api/timer/reanudar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profileId: profile.id,
                localizacion: localizacionFichaje
            })
        });

        const result = await res.json();

        if (result && result.estado) {
            setEstado(result.estado);
        } else {
            console.error("Error al reanudar el timer:", result.error);
        }
    }

    function reanudarTimer() {
        reanudar();
        localStorage.setItem('run', 'true');
    }

    //Establecer a Jornada Finalizada
    async function salida() {
        const res = await fetch('/api/timer/stop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profileId: profile.id,
                localizacion: localizacionFichaje
            })
        });

        const result = await res.json();

        if (result && result.estado) {
            setEstado(result.estado);
        } else {
            console.error("Error al parar el timer:", result.error);
        }
    }

    function stopTimer() {
        salida();
        localStorage.setItem('run', 'false');
        localStorage.setItem('time', '0')
    }

    //Accion del timer
    useEffect(() => {
        if (!isRunning) return;
        const timer: number = window.setInterval(() => {
            setTime(prevTime => {
                const newTime = prevTime + 1;
                localStorage.setItem('time', String(newTime));
                return newTime;
            });
        }, 1000)

        return () => clearInterval(timer);
    }, [isRunning])

    function formatTimer(s: number) {
        const hours = String(Math.floor(s / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
        const seconds = String(s % 60).padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`
    }

    return (
        <>
            {
                (isOpen) && (
                    <div className={styles.overlay}>
                        <div className={styles.modalContainer}>
                            <svg onClick={handleCloseCancel} className={styles.svgModal} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.1811 10.8737L14.3294 15.0219C14.4677 15.1555 14.6529 15.2294 14.8452 15.2278C15.0374 15.2261 15.2214 15.149 15.3573 15.013C15.4933 14.877 15.5704 14.6931 15.5721 14.5009C15.5737 14.3086 15.4998 14.1234 15.3663 13.9851L11.218 9.83679L15.3663 5.68853C15.4998 5.55023 15.5737 5.36499 15.5721 5.17273C15.5704 4.98046 15.4933 4.79654 15.3573 4.66058C15.2214 4.52462 15.0374 4.4475 14.8452 4.44583C14.6529 4.44416 14.4677 4.51807 14.3294 4.65165L10.1811 8.79991L6.03284 4.65165C5.89392 4.52137 5.70976 4.45026 5.51934 4.45335C5.32891 4.45644 5.14716 4.5335 5.01254 4.66821C4.87792 4.80293 4.80099 4.98474 4.79803 5.17516C4.79508 5.36559 4.86632 5.5497 4.99669 5.68853L9.14422 9.83679L4.99596 13.9851C4.92592 14.0527 4.87006 14.1336 4.83163 14.2231C4.7932 14.3125 4.77297 14.4088 4.77212 14.5061C4.77128 14.6035 4.78983 14.7001 4.8267 14.7902C4.86357 14.8803 4.91802 14.9622 4.98687 15.031C5.05572 15.0999 5.1376 15.1543 5.22772 15.1912C5.31784 15.2281 5.4144 15.2466 5.51176 15.2458C5.60913 15.2449 5.70535 15.2247 5.79482 15.1863C5.88428 15.1478 5.9652 15.092 6.03284 15.0219L10.1811 10.8737Z" fill="#333333" />
                            </svg>
                            <div className={styles.contentModal}>
                                <h3>¿Estás seguro de que deseas Fichar la Salida?</h3>
                                <p>Al confirmar esta acción, se registrará oficialmente el fin de tu jornada laboral en el sistema. Asegúrate de haber completado todas tus tareas y de no tener actividades pendientes antes de fichar la salida. Gracias por tu dedicación. ¡Nos vemos en la próxima jornada!</p>
                            </div>
                            <div className={styles.buttonsModal}>
                                <button onClick={handleCloseCancel}>Cancelar</button>
                                <button onClick={handleCloseAccept}>Aceptar</button>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className={styles.container}>
                <div className={styles.title}>
                    <h2>Fichar</h2>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M6.09106 4.63635L13.3638 8.99999L6.09106 13.3636V4.63635Z" fill="white" stroke="white" strokeWidth="1.45455" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                <div className={styles.date}>
                    <h3>{currentDate}</h3>
                    <div className={styles.counter}>
                        <h2>{formatTimer(time)}</h2>
                    </div>
                </div>
                <div className={styles.buttons}>

                    {
                        (!profile.alta) && (
                            <>
                                <button className={styles.entrada} onClick={startTimer} style={{ cursor: 'not-allowed' }} disabled>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M5.83325 4L15.8333 10L5.83325 16V4Z" fill="white" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    FICHAR ENTRADA
                                </button>
                                <button className={styles.salida} onClick={stopTimer} disabled>FICHAR SALIDA</button>
                            </>
                        )
                    }

                    {
                        ((estado == 'Activo') && profile.alta) && (
                            <>
                                <button className={styles.pausa} onClick={pauseTimer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                        <path d="M15.2717 4.51465V15.4854H12.8713V4.51465H15.2717ZM8.41431 4.51465V15.4854H6.01489V4.51465H8.41431Z" fill="#FF7300" stroke="#FF7300" strokeWidth="1.02857" />
                                    </svg>
                                    PAUSA
                                </button>
                                <button className={styles.salida} onClick={handleOpen}>FICHAR SALIDA</button>
                            </>
                        )

                    }

                    {
                        ((estado == 'Inactivo' || estado == 'Jornada Finalizada') && profile.alta) && (
                            <>
                                <button className={styles.entrada} onClick={startTimer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M5.83325 4L15.8333 10L5.83325 16V4Z" fill="white" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    FICHAR ENTRADA
                                </button>
                                <button className={styles.salida} onClick={stopTimer} disabled>FICHAR SALIDA</button>
                            </>
                        )
                    }

                    {
                        ((estado == 'Pausa') && profile.alta) && (
                            <>
                                <button className={styles.entrada} onClick={reanudarTimer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M5.83325 4L15.8333 10L5.83325 16V4Z" fill="white" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    REANUDAR
                                </button>
                                <button className={styles.salida} onClick={handleOpen}>FICHAR SALIDA</button>
                            </>
                        )
                    }

                </div>
            </div>
        </>

    );
}