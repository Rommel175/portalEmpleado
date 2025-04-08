'use client'

import { useEffect, useState } from "react";
import styles from "./ContainerTimer.module.css";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function ContainerTimer({ user }: { user: User }) {
    const [time, setTime] = useState<number>(0);
    const [isRunning, setRunning] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<string>("");
    const supabase = createClient();
    const [estado, setEstado] = useState("");
    const [isOpen, setIsOpen] = useState(false);

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

    //Buscar el estado del empleado al iniciar el componente
    useEffect(() => {
        const localTime = sessionStorage.getItem('time');
        const run = sessionStorage.getItem('run');

        if (localTime) {
            setTime(Number(localTime));
        }

        if (run === 'true') {
            setRunning(true);
        } else {
            setRunning(false);
        }

        const date = new Date();
        const formatDate = new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }).format(date)

        setCurrentDate(formatDate)

        const fetchData = async () => {
            const date3 = new Date();
            const day = String(date3.getDate()).padStart(2, '0');
            const mounth = String(date3.getMonth() + 1).padStart(2, '0');
            const year = date3.getFullYear();

            const { data, error } = await supabase
                .from('historialFichajes')
                .select('estado')
                .eq('created_at', `${year}-${mounth}-${day}`)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching fichaje:', error);
                return;
            }

            if (data && data.length > 0) {
                setEstado(data[0].estado)
            } else {
                console.log('undefined')
            };
        }

        fetchData();


    }, [])

    //AL cambiar el estado fichaje realizar las accions del timer
    useEffect(() => {

        if (estado == 'activo') {
            setRunning(true);
            sessionStorage.setItem('run', 'true');
        } else if (estado == 'inactivo') {
            setRunning(false);
            setTime(0);
            sessionStorage.setItem('run', 'false');
            sessionStorage.setItem('time', '0');
        } else if (estado === 'pausa') {
            setRunning(false);
            sessionStorage.setItem('run', 'false');
        }

    }, [estado])

    //Establecer a Activo el estado del trabajador en la BD
    async function activo() {
        const date3 = new Date();
        const day = String(date3.getDate()).padStart(2, '0');
        const mounth = String(date3.getMonth() + 1).padStart(2, '0');
        const year = date3.getFullYear();

        const { data, error } = await supabase
            .from('historialFichajes')
            .select('id')
            .eq('created_at', `${year}-${mounth}-${day}`)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching fichaje state:', error);
            return;
        }

        //console.log(data);

        if (data && data.length > 0) {
            const fichajeId = data[0].id;
            //console.log(fichajeId)

            const { error: updateError } = await supabase
                .from('historialFichajes')
                .update({ estado: 'activo' })
                .eq('id', fichajeId);

            if (updateError) {
                console.error('Error updating fichaje:', updateError);
                return;
            }

        }
    }

    function startTimer() {
        activo();
        setEstado('activo');
        sessionStorage.setItem('run', 'true');
    }

    //Establecr a pausa el estado del trabajador en la BD
    async function pausa() {
        const date3 = new Date();
        const day = String(date3.getDate()).padStart(2, '0');
        const mounth = String(date3.getMonth() + 1).padStart(2, '0');
        const year = date3.getFullYear();

        const { data, error } = await supabase
            .from('historialFichajes')
            .select('id')
            .eq('created_at', `${year}-${mounth}-${day}`)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching fichaje state:', error);
            return;
        }

        console.log(data);

        if (data && data.length > 0) {
            const fichajeId = data[0].id;
            //console.log(fichajeId)

            const { error: updateError } = await supabase
                .from('historialFichajes')
                .update({ estado: 'pausa' })
                .eq('id', fichajeId);

            if (updateError) {
                console.error('Error updating fichaje:', updateError);
                return;
            }

        }
    }

    function pauseTimer() {
        pausa();
        setEstado('pausa');
        sessionStorage.setItem('run', 'false');
    }

    //Establecer a inactivo el estado del trabajador en la BD
    async function salida() {
        const date3 = new Date();
        const day = String(date3.getDate()).padStart(2, '0');
        const mounth = String(date3.getMonth() + 1).padStart(2, '0');
        const year = date3.getFullYear();

        const { data, error } = await supabase
            .from('historialFichajes')
            .select('id')
            .eq('created_at', `${year}-${mounth}-${day}`)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching fichaje state:', error);
            return;
        }

        //console.log(data);

        if (data && data.length > 0) {
            const fichajeId = data[0].id;
            //console.log(fichajeId)

            const { error: updateError } = await supabase
                .from('historialFichajes')
                .update({ estado: 'inactivo' })
                .eq('id', fichajeId);

            if (updateError) {
                console.error('Error updating fichaje:', updateError);
                return;
            }

        }
    }

    function stopTimer() {
        salida();
        setEstado('inactivo');
        sessionStorage.setItem('run', 'false');
        sessionStorage.setItem('time','0')
    }

    //Accion del timer
    useEffect(() => {
        if (!isRunning) return;
        const timer: number = window.setInterval(() => {
            setTime(prevTime => {
                const newTime = prevTime + 1;
                sessionStorage.setItem('time', String(newTime));
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
                            <svg  onClick={handleCloseCancel} className={styles.svgModal} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.1811 10.8737L14.3294 15.0219C14.4677 15.1555 14.6529 15.2294 14.8452 15.2278C15.0374 15.2261 15.2214 15.149 15.3573 15.013C15.4933 14.877 15.5704 14.6931 15.5721 14.5009C15.5737 14.3086 15.4998 14.1234 15.3663 13.9851L11.218 9.83679L15.3663 5.68853C15.4998 5.55023 15.5737 5.36499 15.5721 5.17273C15.5704 4.98046 15.4933 4.79654 15.3573 4.66058C15.2214 4.52462 15.0374 4.4475 14.8452 4.44583C14.6529 4.44416 14.4677 4.51807 14.3294 4.65165L10.1811 8.79991L6.03284 4.65165C5.89392 4.52137 5.70976 4.45026 5.51934 4.45335C5.32891 4.45644 5.14716 4.5335 5.01254 4.66821C4.87792 4.80293 4.80099 4.98474 4.79803 5.17516C4.79508 5.36559 4.86632 5.5497 4.99669 5.68853L9.14422 9.83679L4.99596 13.9851C4.92592 14.0527 4.87006 14.1336 4.83163 14.2231C4.7932 14.3125 4.77297 14.4088 4.77212 14.5061C4.77128 14.6035 4.78983 14.7001 4.8267 14.7902C4.86357 14.8803 4.91802 14.9622 4.98687 15.031C5.05572 15.0999 5.1376 15.1543 5.22772 15.1912C5.31784 15.2281 5.4144 15.2466 5.51176 15.2458C5.60913 15.2449 5.70535 15.2247 5.79482 15.1863C5.88428 15.1478 5.9652 15.092 6.03284 15.0219L10.1811 10.8737Z" fill="#333333" />
                            </svg>
                            <div className={styles.content}>
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
            <div className={styles.date}>
                <h3>{currentDate}</h3>
                <div className={styles.counter}>
                    <h2>{formatTimer(time)}</h2>
                </div>
            </div>
            <div className={styles.buttons}>
                {
                    (estado == 'activo') && (
                        <>
                            <button className={styles.pausa} onClick={pauseTimer}>
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.5 19V5H18.5V19H14.5ZM6.5 19V5H10.5V19H6.5Z" fill="#FF6E00" />
                                </svg>
                                PAUSA
                            </button>
                            <button className={styles.salida} onClick={handleOpen}>FICHAR SALIDA</button>
                        </>
                    )

                }

                {
                    (estado == 'inactivo') && (
                        <>
                            <button className={styles.entrada} onClick={startTimer}>
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.5 6L18.5 12L8.5 18V6Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                FICHAR ENTRADA
                            </button>
                            <button className={styles.salida} onClick={stopTimer} disabled>FICHAR SALIDA</button>
                        </>
                    )
                }

                {
                    (estado == 'pausa') && (
                        <>
                            <button className={styles.entrada} onClick={startTimer}>
                                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.5 6L18.5 12L8.5 18V6Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                FICHAR ENTRADA
                            </button>
                            <button className={styles.salida} onClick={stopTimer}>FICHAR SALIDA</button>
                        </>
                    )
                }

            </div>
        </>
    );
}