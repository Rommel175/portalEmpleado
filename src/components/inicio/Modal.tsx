'use client'

import { User } from '@supabase/supabase-js';
import styles from './modal.module.css'
import { useState, useEffect } from "react";
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Modal({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(true);
    const [currentDate, setCurrentDate] = useState<string>("");
    const [currentTime, setCurrentTime] = useState<string>("");
    const [estado, setEstado] = useState('');
    const [fullName, setFullName] = useState('');
    const [idProfile, setIdProfile] = useState('');
    const [localizacionFichaje, setLocalizacionFichaje] = useState('oficina');
    const [horaFinalAprox, setHoraFinalAprox] = useState({
        value: '',
        hasError: false
    });
    const hourRegexp = new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/);

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const date = new Date();

            const formatDate = new Intl.DateTimeFormat("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }).format(date)

            setCurrentDate(formatDate)

            const formatHour = new Intl.DateTimeFormat("es-ES", {
                hour: "2-digit",
                minute: "2-digit"
            }).format(date)

            setCurrentTime(formatHour)

            const { data: dataProfile, error: errorProfile } = await supabase
                .from('profiles')
                .select('estado, id, full_name')
                .eq('user_id', user.id)

            if (errorProfile) {
                console.log('Error fetching state: ', errorProfile)
            }

            if (dataProfile && dataProfile.length > 0) {
                setEstado(dataProfile[0].estado);
                setIdProfile(dataProfile[0].id);
                setFullName(dataProfile[0].full_name);
            }
        }

        fetchData();
    }, []);

    async function fichar() {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const { data, error } = await supabase
            .from('fichaje_jornada')
            .select('id')
            .eq('created_at', `${year}-${month}-${day}`)
            .eq('profile_id', idProfile)

        if (error) {
            console.log('Error fetching fichaje: ', error);
        }

        if (!data || data.length == 0) {
            const { error: errorInsertFichaje } = await supabase
                .from('fichaje_jornada')
                .insert({ created_at: `${year}-${month}-${day}`, profile_id: idProfile, hora_aprox_salida: horaFinalAprox.value })

            if (errorInsertFichaje) {
                console.log('Error insert fichaje: ', errorInsertFichaje)
            }

            const { data: dataFichaje, error: errorFichaje } = await supabase
                .from('fichaje_jornada')
                .select('id')
                .eq('profile_id', idProfile)
                .eq('created_at', `${year}-${month}-${day}`)

            if (errorFichaje) {
                console.log('Error fetching fichaje');
            }

            if (dataFichaje && dataFichaje.length > 0) {
                const idFichaje = dataFichaje[0].id;

                const { error: errorInsertFichajeEvent } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: idFichaje, evento: 'Inicio Jornada', hora: currentTime, localizacion: localizacionFichaje });

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

                    if (errorUpdatingEstado) {
                        console.log('Error updating estado: ', errorUpdatingEstado)
                    }
                }
            }

        } else {

            const fichajeId = data[0].id;

            const { error: errorInsertFichajeEvent } = await supabase
                .from('fichaje_eventos')
                .insert({ fichaje_id: fichajeId, evento: 'Inicio Jornada', hora: currentTime, localizacion: localizacionFichaje });

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

                if (errorUpdatingEstado) {
                    console.log('Error updating estado: ', errorUpdatingEstado)
                }
            }
        }

        //PENDENTE HACER LÓGICA PARA EVITAR DUPLICIDAD
    }

    function handleClose() {
        setIsOpen(false);
    }

    async function handleSubmit() {

        if (!horaFinalAprox.value || !hourRegexp.test(horaFinalAprox.value)) {
            return;
        }

        setIsOpen(false);
        fichar();
        router.push('/');
    }

    function handleChangeLocation(e: React.ChangeEvent<HTMLSelectElement>) {
        setLocalizacionFichaje(e.target.value);
    }

    function handleChangeHoraAprox(e: React.ChangeEvent<HTMLInputElement>) {
        setHoraFinalAprox({ ...horaFinalAprox, value: e.target.value });
    }

    function handleBlurHoraAprox() {
        const hasError = !hourRegexp.test(horaFinalAprox.value);
        setHoraFinalAprox((prevState) => ({ ...prevState, hasError }))
    }

    return (
        (isOpen && (estado === 'Inactivo' || estado === 'Jornada Finalizada')) &&

        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <form className={styles.form} onSubmit={handleSubmit} >
                    <header className={styles.formHeader}>
                        <h1>!Hola {fullName}!</h1>
                        <h2>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui ad quisquam consequatur maiores suscipit voluptatum necessitatibus placeat molestias nulla incidunt dolor dolores fugit, odit assumenda reiciendis ipsum culpa alias. Ex!</h2>
                    </header>

                    <div className={styles.formGroup}>
                        <div className={styles.date}>
                            <div className={styles.dateItem}>
                                <label htmlFor="date">Fecha</label>
                                <input type="text" name='date' defaultValue={currentDate} readOnly />
                            </div>
                            <div className={styles.dateItem}>
                                <label htmlFor="hour">Hora</label>
                                <input type="text" name='hour' defaultValue={currentTime} readOnly />
                            </div>
                        </div>

                        <div className={styles.location}>
                            <label htmlFor="location">Localización</label>
                            <select name="location" value={localizacionFichaje || ''} onChange={handleChangeLocation}>
                                <option value="oficina">Oficina</option>
                                <option value="casa">Casa</option>
                                <option value="viaje">Viaje</option>
                            </select>
                        </div>

                        <div className={styles.departureTime}>
                            <label htmlFor="departureTime">
                                Hora prevista Final de Jornada
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.97506 9C6.15006 9 6.29806 8.9395 6.41906 8.8185C6.54006 8.6975 6.60039 8.54967 6.60006 8.375C6.59973 8.20034 6.53939 8.05234 6.41906 7.931C6.29873 7.80967 6.15073 7.74934 5.97506 7.75C5.79939 7.75067 5.65156 7.81117 5.53156 7.9315C5.41156 8.05184 5.35106 8.19967 5.35006 8.375C5.34906 8.55034 5.40956 8.69834 5.53156 8.819C5.65356 8.93967 5.80139 9 5.97506 9ZM5.52506 7.075H6.45006C6.45006 6.8 6.48139 6.58334 6.54406 6.425C6.60673 6.26667 6.78373 6.05 7.07506 5.775C7.29173 5.55834 7.46256 5.352 7.58756 5.156C7.71256 4.96 7.77506 4.72467 7.77506 4.45C7.77506 3.98334 7.60423 3.625 7.26256 3.375C6.92089 3.125 6.51673 3 6.05006 3C5.57506 3 5.18973 3.125 4.89406 3.375C4.5984 3.625 4.39206 3.925 4.27506 4.275L5.10006 4.6C5.14173 4.45 5.23556 4.2875 5.38156 4.1125C5.52756 3.9375 5.75039 3.85 6.05006 3.85C6.31673 3.85 6.51673 3.923 6.65006 4.069C6.78339 4.215 6.85006 4.37534 6.85006 4.55C6.85006 4.71667 6.80006 4.873 6.70006 5.019C6.60006 5.165 6.47506 5.30034 6.32506 5.425C5.95839 5.75 5.7334 5.99584 5.65006 6.1625C5.56673 6.32917 5.52506 6.63334 5.52506 7.075ZM6.00006 11C5.30839 11 4.6584 10.8688 4.05006 10.6065C3.44173 10.3442 2.91256 9.98784 2.46256 9.5375C2.01256 9.08717 1.6564 8.558 1.39406 7.95C1.13173 7.342 1.0004 6.692 1.00006 6C0.999728 5.308 1.13106 4.658 1.39406 4.05C1.65706 3.442 2.01323 2.91284 2.46256 2.4625C2.9119 2.01217 3.44106 1.656 4.05006 1.394C4.65906 1.132 5.30906 1.00067 6.00006 1C6.69106 0.999336 7.34106 1.13067 7.95006 1.394C8.55906 1.65734 9.08823 2.0135 9.53756 2.4625C9.9869 2.9115 10.3432 3.44067 10.6066 4.05C10.8699 4.65934 11.0011 5.30934 11.0001 6C10.9991 6.69067 10.8677 7.34067 10.6061 7.95C10.3444 8.55934 9.98823 9.0885 9.53756 9.5375C9.0869 9.9865 8.55773 10.3428 7.95006 10.6065C7.34239 10.8702 6.69239 11.0013 6.00006 11Z" fill="#333333" />
                                </svg>
                            </label>
                            <input type="text" value={horaFinalAprox.value} onChange={handleChangeHoraAprox} onBlur={handleBlurHoraAprox} placeholder='Ex: 18:30' required />
                            {
                                (horaFinalAprox.hasError) &&
                                <span style={{ color: 'red' }}>No es una hora válida</span>
                            }
                        </div>

                        <div className={styles.note}>
                            <label htmlFor="note">
                                Notas
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.97506 9C6.15006 9 6.29806 8.9395 6.41906 8.8185C6.54006 8.6975 6.60039 8.54967 6.60006 8.375C6.59973 8.20034 6.53939 8.05234 6.41906 7.931C6.29873 7.80967 6.15073 7.74934 5.97506 7.75C5.79939 7.75067 5.65156 7.81117 5.53156 7.9315C5.41156 8.05184 5.35106 8.19967 5.35006 8.375C5.34906 8.55034 5.40956 8.69834 5.53156 8.819C5.65356 8.93967 5.80139 9 5.97506 9ZM5.52506 7.075H6.45006C6.45006 6.8 6.48139 6.58334 6.54406 6.425C6.60673 6.26667 6.78373 6.05 7.07506 5.775C7.29173 5.55834 7.46256 5.352 7.58756 5.156C7.71256 4.96 7.77506 4.72467 7.77506 4.45C7.77506 3.98334 7.60423 3.625 7.26256 3.375C6.92089 3.125 6.51673 3 6.05006 3C5.57506 3 5.18973 3.125 4.89406 3.375C4.5984 3.625 4.39206 3.925 4.27506 4.275L5.10006 4.6C5.14173 4.45 5.23556 4.2875 5.38156 4.1125C5.52756 3.9375 5.75039 3.85 6.05006 3.85C6.31673 3.85 6.51673 3.923 6.65006 4.069C6.78339 4.215 6.85006 4.37534 6.85006 4.55C6.85006 4.71667 6.80006 4.873 6.70006 5.019C6.60006 5.165 6.47506 5.30034 6.32506 5.425C5.95839 5.75 5.7334 5.99584 5.65006 6.1625C5.56673 6.32917 5.52506 6.63334 5.52506 7.075ZM6.00006 11C5.30839 11 4.6584 10.8688 4.05006 10.6065C3.44173 10.3442 2.91256 9.98784 2.46256 9.5375C2.01256 9.08717 1.6564 8.558 1.39406 7.95C1.13173 7.342 1.0004 6.692 1.00006 6C0.999728 5.308 1.13106 4.658 1.39406 4.05C1.65706 3.442 2.01323 2.91284 2.46256 2.4625C2.9119 2.01217 3.44106 1.656 4.05006 1.394C4.65906 1.132 5.30906 1.00067 6.00006 1C6.69106 0.999336 7.34106 1.13067 7.95006 1.394C8.55906 1.65734 9.08823 2.0135 9.53756 2.4625C9.9869 2.9115 10.3432 3.44067 10.6066 4.05C10.8699 4.65934 11.0011 5.30934 11.0001 6C10.9991 6.69067 10.8677 7.34067 10.6061 7.95C10.3444 8.55934 9.98823 9.0885 9.53756 9.5375C9.0869 9.9865 8.55773 10.3428 7.95006 10.6065C7.34239 10.8702 6.69239 11.0013 6.00006 11Z" fill="#333333" />
                                </svg>
                            </label>
                            <textarea name="note" placeholder='Escribe aquí tu texto...'></textarea>
                        </div>

                        <div className={styles.buttons}>
                            <button type='button' onClick={handleClose}>Saltar fichajes</button>
                            <button type='submit'>Fichar</button>
                        </div>

                    </div>

                </form>
                <Image src={'https://s3-alpha-sig.figma.com/img/862b/ae99/e7d28aca5cd5b5184aa0ba64d4e73de2?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=i4rRIX3BVfmoHV4UMa9a5tEKT61pUwbN2S97qEYv61lro7YIBOctsENSfRnhwvxoVOTFJ6kxAufTRT1GF8LmDGfQVTQVIPGj8hfvqyNYSC-OZUa1hT66-AvlUSDek9hi9MiIoWHttASAE4Kyxo2q3avJ~K1RRaSZTvj4PQbLipIuDCcXRrkXVrW14UGNinVPMZFHC69pHPAGeUc2pOxb2tHd8-25lFfsAE2-qMA4CII58Smm63X7Xua7DMzqX~d-SiAEpqE~YHmCX3CnQwlQEHnspyQE9EAVDF4VQ1T~OiJg6kuilD3ES96lMekF4S9pWAUYbPf6Bd-ow0zTLYvvpw'} width={542} height={756} alt='img' />
            </div>
        </div>

    );
}