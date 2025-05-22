'use client'

import styles from './containerFichaje.module.css'
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Fichaje_eventos, Profile } from "@/types/Types";
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import duration from 'dayjs/plugin/duration';
import SnackbarSuccess from '@/components/snackbar/success/SnackbarSuccess';
import SnackbarError from '@/components/snackbar/error/SnackbarError';

dayjs.extend(duration);

export default function ContainerFichaje({ estado, setEstado, profile, localizacionFichaje }: { estado: string, setEstado: React.Dispatch<React.SetStateAction<string>>, profile: Profile, localizacionFichaje: string }) {

    const [isOpen, setIsOpen] = useState(false);
    const [isRunning, setRunning] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<string>("");
    const [horaFinalAprox, setHoraFinalAprox] = useState<Date | null>(null);
    const [horaInicio, setHoraInicio] = useState<Date | null>(null);
    const [tiempoBase, setTiempoBase] = useState<number | null>(null);
    const [eventos, setEventos] = useState<Fichaje_eventos[] | null>(null);

    //snackbars
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [snackbarError, setSnackbarError] = useState(false);

    useEffect(() => {
        if (snackbarSuccess) {
            const timer = setTimeout(() => {
                setSnackbarSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbarSuccess]);

    const supabase = createClient();

    function tiempoTrabajado(eventos: Fichaje_eventos[]) {
        let pausaInicio: dayjs.Dayjs | null = null;
        let jornadaInicio: dayjs.Dayjs | null = null;

        let tiempoPausa = dayjs.duration(0);
        let finJornada: dayjs.Dayjs | null = null;

        const nuevosOffsets: number[] = [];

        for (const e of eventos) {
            const hora = dayjs(e.date);

            switch (e.evento) {
                case 'Inicio Jornada':
                    if (finJornada) {
                        const offsetHoras = hora.diff(finJornada, 'second');
                        if (offsetHoras > 0) {
                            nuevosOffsets.push(offsetHoras);
                        }
                        finJornada = null;
                    }
                    jornadaInicio = hora;
                    pausaInicio = null;
                    break;
                case 'Inicio Pausa':
                    if (jornadaInicio && !pausaInicio) {
                        pausaInicio = hora;
                    }
                    break;
                case 'Fin Pausa':
                    if (jornadaInicio && pausaInicio) {
                        const pausaSegundos = hora.diff(pausaInicio, 'second');
                        tiempoPausa = tiempoPausa.add(pausaSegundos, 'second');
                        pausaInicio = null;
                    }
                    break;
                case 'Jornada Finalizada':
                    if (jornadaInicio) {
                        finJornada = hora;
                    }
                    break;
            }
        }

        function calculoOffset(offsets: number[]) {
            let total = 0;

            for (const offset of offsets) {
                total += offset;
            }

            return total;
        }

        /*console.log('Tiempo pausa 1',tiempoPausa.format('HH:mm'))
        console.log('Tiempo pausa 2',tiempoPausa)
        console.log('offsets',nuevosOffsets)
        console.log('Calculo de offsets',calculoOffset(nuevosOffsets));
        console.log('Format offset total: ', segundosOffset.format('HH:mm'));
        console.log(calculoOffset(nuevosOffsets))
        console.log(dayjs(horaInicio))

        setOffsets(nuevosOffsets);*/

        const segundosOffset = dayjs.duration(calculoOffset(nuevosOffsets), 'seconds');
        const totalDuracion = tiempoPausa.add(segundosOffset);

        if (pausaInicio) {
            const now = dayjs();
            const pausaEnCurso = now.diff(pausaInicio, 'seconds');

            return totalDuracion.add(pausaEnCurso, 'seconds');
        }

        return totalDuracion;
    }

    useEffect(() => {
        /*const localTime = localStorage.getItem('time');

        if (localTime) {
            setTime(Number(localTime));
        }*/

        const run = localStorage.getItem('run');

        if (run === 'true') {
            setRunning(true);
        } else {
            setRunning(false);
        }

        dayjs.locale('es');

        const date = dayjs();

        setCurrentDate(date.format("DD MMMM YYYY"));

        const horasTrabajo = profile.horas_semana / 5;

        const horaFinal = date.add(horasTrabajo, 'hour');

        setHoraFinalAprox(horaFinal.toDate());

        const fetchFichaje = async () => {

            const date = dayjs();
            const startDate = date.startOf('day');
            const endDate = startDate.add(1, 'day');

            const { data, error } = await supabase
                .from('fichaje_jornada')
                .select('*')
                .gte('date', startDate.toISOString())
                .lt('date', endDate.toISOString())
                .eq('profile_id', profile.id);

            if (error) {
                console.error('Error al obtener fichaje:', error);
                return;
            }

            if (data && data.length > 0) {
                const { data: dataEventos, error: errorEventos } = await supabase
                    .from('fichaje_eventos')
                    .select('*')
                    .eq('fichaje_id', data[0].id)
                    .order('date', { ascending: true })

                if (errorEventos) {
                    console.error('Error al obtener fichaje:', errorEventos);
                    return;
                }

                if (dataEventos && dataEventos.length > 0) {
                    console.log(dataEventos[0].date);
                    setHoraInicio(dataEventos[0].date);
                    setEventos(dataEventos);

                    if (estado == 'Pausa' || estado == 'Activo') {
                        const tiempoDuracion = tiempoTrabajado(dataEventos);
                        const now = dayjs();
                        //console.log('Fecha 1',now.format('HH:mm'));
                        //console.log('Fecha 2',dayjs(data[0].date).format('HH:mm'));
                        const diffInSeconds = now.diff(dayjs(data[0].date), 'second');
                        //console.log(formatTimer(diffInSeconds))

                        const segundosTrabajados = tiempoDuracion.asSeconds();
                        //console.log(tiempoDuracion.format('HH:mm:ss'));
                        //console.log(segundosTrabajados)

                        const time = diffInSeconds - segundosTrabajados;
                        //console.log('Tiempo 1', time);
                        //console.log('Tiempo 2', formatTimer(time));
                        setTiempoBase(time);
                    }
                }
            }
        };

        fetchFichaje();

        const profilesRealTime = supabase
            .channel('realtime-contenedor-fichar')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
            }, (payload: RealtimePostgresChangesPayload<Profile>) => {

                const fetchData = async () => {
                    const date = dayjs();
                    const startDate = date.startOf('day');
                    const endDate = startDate.add(1, 'day');

                    const { data, error } = await supabase
                        .from('fichaje_jornada')
                        .select('*')
                        .gte('date', startDate.toISOString())
                        .lt('date', endDate.toISOString())
                        .eq('profile_id', profile.id);

                    if (error) {
                        console.log('Error realTime 1: ', error);
                    }

                    if (data && data.length > 0) {
                        const { data: dataEventos, error: errorEventos } = await supabase
                            .from('fichaje_eventos')
                            .select('*')
                            .eq('fichaje_id', data[0].id)
                            .order('date', { ascending: true })

                        if (errorEventos) {
                            console.error('Error al obtener fichaje:', errorEventos);
                            return;
                        }

                        if (dataEventos && dataEventos.length > 0) {
                            setHoraInicio(dataEventos[0].date);
                            setEventos(dataEventos);
                        }
                    }

                }

                switch (payload.eventType) {
                    case 'UPDATE':
                        if (payload.new.id !== profile.id) return;
                        //console.log(payload.new);
                        const updatedItem = payload.new;
                        setEstado(updatedItem.estado);
                        fetchData();
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
            setTiempoBase(0);
            localStorage.setItem('run', 'false');
            //localStorage.setItem('time', '0');
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

        if (!res.ok) {
            console.error('Error en la respuesta:', res.status);
            setSnackbarError(true);
            setMessage('Tu hora de entrada no ha sido registrada correctamente.');
            return;
        }

        const result = await res.json();

        if (result && result.estado) {
            setEstado(result.estado);
            setSnackbarSuccess(true);
            setMessage('Tu hora de entrada ha sido registrada correctamente.');
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

        if (!res.ok) {
            console.error('Error en la respuesta:', res.status);
            setSnackbarError(true);
            setMessage('Tu pausa no ha sido registrada correctamente.');
            return;
        }

        const result = await res.json();

        if (result && result.estado) {
            setEstado(result.estado);
            setSnackbarSuccess(true);
            setMessage('Tu pausa ha sido registrada correctamente.');
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

        if (!res.ok) {
            console.error('Error en la respuesta:', res.status);
            setSnackbarError(true);
            setMessage('Tu hora de entrada no ha sido registrada correctamente.');
            return;
        }

        const result = await res.json();

        if (result && result.estado) {
            setEstado(result.estado);
            setSnackbarSuccess(true);
            setMessage('Tu hora de entrada ha sido registrada correctamente.');
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

        if (!res.ok) {
            console.error('Error en la respuesta:', res.status);
            setSnackbarError(true);
            setMessage('Tu hora de salida no ha sido registrada correctamente.');
            return;
        }

        const result = await res.json();

        if (result && result.estado) {
            setEstado(result.estado);
            setSnackbarSuccess(true);
            setMessage('Tu hora de salida ha sido registrada correctamente.');
        }
    }

    function stopTimer() {
        salida();
        localStorage.setItem('run', 'false');
        localStorage.setItem('time', '0')
    }

    //Accion del timer
    useEffect(() => {
        if (!isRunning || eventos == null) return;

        const tiempoDuracion = tiempoTrabajado(eventos);

        const timer = window.setInterval(() => {
            const now = dayjs()
            console.log('ahora', now.toISOString())
            console.log('horaInicio', horaInicio);
            const diffInSeconds = now.diff(dayjs(horaInicio), 'second');
            console.log(diffInSeconds)

            const segundosTrabajados = tiempoDuracion.asSeconds();
            const time = diffInSeconds - segundosTrabajados;
            console.log(time);
            //const time = Math.max(0, diffInSeconds - segundosTrabajados);
            setTiempoBase(time);
        }, 1000);

        return () => clearInterval(timer);

    }, [isRunning, eventos, horaInicio, estado])


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

            {
                (snackbarSuccess) && 
                <SnackbarSuccess setSnackbarSuccess={setSnackbarSuccess} message={message} />
            }

            {
                (snackbarError) &&
                <SnackbarError setSnackbarError={setSnackbarError} message={message} />
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
                        <h2>{formatTimer(tiempoBase ?? 0)}</h2>
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