'use client'

import { User } from "@supabase/supabase-js";
import styles from './containerFichaje.module.css'
import ContainerHeader from "../../ContainerHeader";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ContainerFichaje({ estado, setEstado, user, localizacionFichaje /*, setEventoFichaje, eventoFichaje*/ }: { estado: string, setEstado: React.Dispatch<React.SetStateAction<string>>, user: User, localizacionFichaje: string, /*setEventoFichaje: React.Dispatch<React.SetStateAction<string>>, eventoFichaje: string*/ }) {

    const [isOpen, setIsOpen] = useState(false);
    const [isRunning, setRunning] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [currentDate, setCurrentDate] = useState<string>("");
    const supabase = createClient();

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

    }, []);

    //AL cambiar el estado fichaje realizar las accions del timer
    useEffect(() => {

        if (estado == 'Activo') {
            setRunning(true);
            sessionStorage.setItem('run', 'true');
        } else if (estado == 'Inactivo' || estado == 'Jornada Finalizada') {
            setRunning(false);
            setTime(0);
            sessionStorage.setItem('run', 'false');
            sessionStorage.setItem('time', '0');
        } else if (estado === 'Pausa') {
            setRunning(false);
            sessionStorage.setItem('run', 'false');
        }

    }, [estado])

    //Establecer a Activo 
    async function activo() {

        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const formatHour = new Intl.DateTimeFormat("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(date)



        const { data, error } = await supabase
            .from('fichaje_jornada')
            .select('id')
            .eq('created_at', `${year}-${month}-${day}`)
            .eq('user_id', user.id)

        if (error) {
            console.log('Error fetching fichaje: ', error);
        }


        //AÑADIR HORA APROX SALIDA MÁS TARDE
        if (!data || data.length == 0) {
            const { error: errorInsertFichaje } = await supabase
                .from('fichaje_jornada')
                .insert({ created_at: `${year}-${month}-${day}`, user_id: user.id })

            if (errorInsertFichaje) {
                console.log('Error insert fichaje: ', errorInsertFichaje)
            }

            const { data: dataFichaje, error: errorFichaje } = await supabase
                .from('fichaje_jornada')
                .select('id')
                .eq('user_id', user.id)
                .eq('created_at', `${year}-${month}-${day}`)

            if (errorFichaje) {
                console.log('Error fetching fichaje');
            }

            if (dataFichaje && dataFichaje.length > 0) {
                const idFichaje = dataFichaje[0].id;

                const { error: errorInsertFichajeEvent } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: idFichaje, evento: 'Inicio Jornada', hora: formatHour, localizacion: localizacionFichaje });

                if (errorInsertFichajeEvent) {
                    console.log('Error insert Fichaje_event: ', errorInsertFichajeEvent)
                }

                const { data: dataEstado, error: errorEstado } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('user_id', user.id)

                if (errorEstado) {
                    console.log('Error fetching esatdo: ', errorEstado);
                }

                if (dataEstado && dataEstado.length > 0) {
                    const profileId = dataEstado[0].id;

                    const { error: errorUpdatingEstado } = await supabase
                        .from('profiles')
                        .update({ estado: 'Activo' })
                        .eq('id', profileId)

                    setEstado('Activo')

                    if (errorUpdatingEstado) {
                        console.log('Error updating estado: ', errorUpdatingEstado)
                    }
                }
            }

        } else {

            const formatHour = new Intl.DateTimeFormat("es-ES", {
                hour: "2-digit",
                minute: "2-digit"
            }).format(date)

            const fichajeId = data[0].id;

            const { error: errorInsertFichajeEvent } = await supabase
                .from('fichaje_eventos')
                .insert({ fichaje_id: fichajeId, evento: 'Inicio Jornada', hora: formatHour, localizacion: localizacionFichaje });

            if (errorInsertFichajeEvent) {
                console.log('Error insert Fichaje_event: ', errorInsertFichajeEvent)
            }

            const { data: dataEstado, error: errorEstado } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', user.id)

            if (errorEstado) {
                console.log('Error fetching esatdo: ', errorEstado);
            }

            if (dataEstado && dataEstado.length > 0) {
                const profileId = dataEstado[0].id;

                const { error: errorUpdatingEstado } = await supabase
                    .from('profiles')
                    .update({ estado: 'Activo' })
                    .eq('id', profileId)

                setEstado('Activo')

                if (errorUpdatingEstado) {
                    console.log('Error updating estado: ', errorUpdatingEstado)
                }
            }
        }

    };

    function startTimer() {
        activo();
        sessionStorage.setItem('run', 'true');
    }

    //Establecr a pausa 
    async function pausa() {

        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const formatHour = new Intl.DateTimeFormat("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(date)

        const { data, error } = await supabase
            .from('fichaje_jornada')
            .select('id')
            .eq('created_at', `${year}-${month}-${day}`)
            .eq('user_id', user.id)

        if (error) {
            console.log('Error fetching fichaje: ', error);
        }

        if (data && data.length > 0) {
            const fichajeId = data[0].id;

            const { error: errorInsertFichajeEvent } = await supabase
                .from('fichaje_eventos')
                .insert({ fichaje_id: fichajeId, evento: 'Inicio Pausa', hora: formatHour, localizacion: localizacionFichaje });

            if (errorInsertFichajeEvent) {
                console.log('Error insert Fichaje Evento: ', errorInsertFichajeEvent);
            }

            const { data: dataEstado, error: errorEstado } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', user.id);

            if (errorEstado) {
                console.error('Error fetching state:', error);
                return;
            }

            if (dataEstado && dataEstado.length > 0) {
                const profileId = dataEstado[0].id;
                //console.log(fichajeId)

                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ estado: 'Pausa' })
                    .eq('id', profileId);

                setEstado('Pausa')

                if (updateError) {
                    console.error('Error updating fichaje:', updateError);
                    return;
                }

            }
        }
    }

    function pauseTimer() {
        pausa();
        sessionStorage.setItem('run', 'false');
    }

    //Reanudar jornada

    async function reanudar() {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const formatHour = new Intl.DateTimeFormat("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(date)

        const { data, error } = await supabase
            .from('fichaje_jornada')
            .select('id')
            .eq('created_at', `${year}-${month}-${day}`)
            .eq('user_id', user.id)

        if (error) {
            console.log('Error fetching fichaje: ', error);
        }

        if (data && data.length > 0) {
            const fichajeId = data[0].id;

            const { error: errorInsertFichajeEvent } = await supabase
                .from('fichaje_eventos')
                .insert({ fichaje_id: fichajeId, evento: 'Fin Pausa', hora: formatHour, localizacion: localizacionFichaje });

            if (errorInsertFichajeEvent) {
                console.log('Error insert Fichaje Evento: ', errorInsertFichajeEvent);
            }

            const { data: dataEstado, error: errorEstado } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', user.id);

            if (errorEstado) {
                console.error('Error fetching state:', error);
                return;
            }

            if (dataEstado && dataEstado.length > 0) {
                const profileId = dataEstado[0].id;
                //console.log(fichajeId)

                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ estado: 'Activo' })
                    .eq('id', profileId);

                setEstado('Activo')

                if (updateError) {
                    console.error('Error updating fichaje:', updateError);
                    return;
                }

            }
        }
    }

    function reanudarTimer() {
        reanudar();
        sessionStorage.setItem('run', 'true');
    }

    //Establecer a inactivo
    async function salida() {

        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const formatHour = new Intl.DateTimeFormat("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(date)

        const { data, error } = await supabase
            .from('fichaje_jornada')
            .select('id')
            .eq('created_at', `${year}-${month}-${day}`)
            .eq('user_id', user.id)

        if (error) {
            console.log('Error fetching fichaje: ', error);
        }

        if (data && data.length > 0) {
            const fichajeId = data[0].id;

            const { data: dataFichajeLastEvent, error: errorFichajeLastEvent } = await supabase
                .from('fichaje_eventos')
                .select('evento')
                .eq('fichaje_id', fichajeId)
                .order('id', { ascending: false })
                .limit(1);

            if (errorFichajeLastEvent) {
                console.log('Error fetching Evento Pausa: ', errorFichajeLastEvent);
            }

            if (dataFichajeLastEvent && dataFichajeLastEvent.length > 0 && dataFichajeLastEvent[0].evento == 'Inicio Pausa') {

                const { error: errorInsertFichajeEvent } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: fichajeId, evento: 'Fin Pausa', hora: formatHour, localizacion: localizacionFichaje });

                if (errorInsertFichajeEvent) {
                    console.log('Error insert Fichaje Evento: ', errorInsertFichajeEvent);
                }

                const { error: errorInsertFichajeEvent2 } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: fichajeId, evento: 'Jornada Finalizada', hora: formatHour, localizacion: localizacionFichaje });

                if (errorInsertFichajeEvent2) {
                    console.log('Error insert Fichaje Evento: ', errorInsertFichajeEvent2);
                }

            } else {

                const { error: errorInsertFichajeEvent } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: fichajeId, evento: 'Jornada Finalizada', hora: formatHour, localizacion: localizacionFichaje });

                if (errorInsertFichajeEvent) {
                    console.log('Error insert Fichaje Evento: ', errorInsertFichajeEvent);
                }

            }

            const { data: dataEstado, error: errorEstado } = await supabase
                .from('profiles')
                .select('id')
                .eq('user_id', user.id);

            if (errorEstado) {
                console.error('Error fetching state:', error);
                return;
            }

            if (dataEstado && dataEstado.length > 0) {
                const profileId = dataEstado[0].id;
                //console.log(fichajeId)

                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ estado: 'Jornada Finalizada' })
                    .eq('id', profileId);

                setEstado('Jornada Finalizada');

                if (updateError) {
                    console.error('Error updating fichaje:', updateError);
                    return;
                }
            }
        }
    }

    function stopTimer() {
        salida();
        sessionStorage.setItem('run', 'false');
        sessionStorage.setItem('time', '0')
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


    const svg = (
        <svg
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.1113 18.8034C15.3596 18.8034 18.8036 15.3594 18.8036 11.1111C18.8036 6.86273 15.3596 3.41876 11.1113 3.41876C6.86291 3.41876 3.41895 6.86273 3.41895 11.1111C3.41895 15.3594 6.86291 18.8034 11.1113 18.8034Z"
                stroke="#0B3C70"
                strokeWidth="1.28742"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.2566 7.69189V11.9654H14.5301"
                stroke="#0B3C70"
                strokeWidth="1.28742"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

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
                <ContainerHeader name={'Fichar'} svg={svg} />
                <div className={styles.content}>
                    <div className={styles.date}>
                        <h3>{currentDate}</h3>
                        <div className={styles.counter}>
                            <h2>{formatTimer(time)}</h2>
                        </div>
                    </div>
                    <div className={styles.buttons}>
                        {
                            (estado == 'Activo') && (
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
                            (estado == 'Inactivo' || estado == 'Jornada Finalizada') && (
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
                            (estado == 'Pausa') && (
                                <>
                                    <button className={styles.entrada} onClick={reanudarTimer}>
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.5 6L18.5 12L8.5 18V6Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        REANUDAR
                                    </button>
                                    <button className={styles.salida} onClick={handleOpen}>FICHAR SALIDA</button>
                                </>
                            )
                        }

                    </div>
                </div>
            </div>
        </>

    );
}