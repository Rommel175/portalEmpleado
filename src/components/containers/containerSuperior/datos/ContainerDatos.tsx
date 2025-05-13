'use client'

import styles from './containerDatos.module.css'
import Image from "next/image";
import { Fichaje_jornada, Profile } from '@/types/Types';
import Link from 'next/link';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import dayjs from 'dayjs';
import Tooltips from '@/components/tooltip/Tooltips';

export default function DatosContainer({ profile, estado, localizacionFichaje, setLocalizacionFichaje, horaInicio, setHoraInicio, horaFinalAprox, setHoraFinalAprox }: { profile: Profile, estado: string, localizacionFichaje: string, setLocalizacionFichaje: React.Dispatch<React.SetStateAction<string>>, horaInicio: string | Date, setHoraInicio: React.Dispatch<React.SetStateAction<Date>>, horaFinalAprox: string | Date, setHoraFinalAprox: React.Dispatch<React.SetStateAction<Date>> }) {

    const supabase = createClient();

    useEffect(() => {
        const jornadaRealTime = supabase
            .channel('realtime-fichaje_jornada-contenedor_datos')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'fichaje_jornada',
            }, (payload: RealtimePostgresChangesPayload<Fichaje_jornada>) => {
                switch (payload.eventType) {
                    case 'INSERT':
                        const insertItem = payload.new;
                        setHoraInicio(insertItem.date);
                        setHoraFinalAprox(insertItem.date_final_aprox);
                        break;
                    case 'UPDATE':
                        const updatedItem = payload.new;
                        setHoraInicio(updatedItem.date);
                        setHoraFinalAprox(updatedItem.date);
                        break;
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(jornadaRealTime);
        };
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setLocalizacionFichaje(e.target.value);
    }

    function parseHora(hora: string | Date): string {
        if (!hora) return '-';
        const date = dayjs(hora)
        if (!date.isValid()) return '—';
        return date.format('HH:mm')
    }

    return (
        <div className={styles.container}>

            <div className={styles.state}>
                {
                    (estado == 'Activo') &&
                    <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="3.5" cy="3" r="3" fill="#0DC44A" />
                    </svg>
                }

                {
                    (estado == 'Inactivo') &&
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="3.5" cy="3.5" r="3" fill="#E94544" />
                    </svg>
                }

                {
                    (estado == 'Pausa') &&
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="3.5" cy="3.5" r="3" fill="#FF6E00" />
                    </svg>
                }

                {
                    (estado == 'Jornada Finalizada') &&
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="3.5" cy="3.5" r="3" fill="#828282" />
                    </svg>
                }

                <p>{estado}</p>
            </div>

            <div className={styles.profile}>

                <Image
                    src={profile.image}
                    width={60}
                    height={60}
                    alt="img"
                    className={styles.personalImage}
                />

                <div className={styles.personalInfo}>
                    <h2>{profile.nombre} {profile.apellido || ''}</h2>
                    <h3>{profile.puesto || 'No especificado'} | {profile.email}</h3>
                </div>

                <div className={styles.edit}>
                    <Link href={'/dashboard/editar_perfil'}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_197_8779)">
                                <path d="M8.5 1.50003C8.63132 1.36871 8.78722 1.26454 8.9588 1.19347C9.13038 1.1224 9.31428 1.08582 9.5 1.08582C9.68572 1.08582 9.86962 1.1224 10.0412 1.19347C10.2128 1.26454 10.3687 1.36871 10.5 1.50003C10.6313 1.63135 10.7355 1.78725 10.8066 1.95883C10.8776 2.13041 10.9142 2.31431 10.9142 2.50003C10.9142 2.68575 10.8776 2.86964 10.8066 3.04123C10.7355 3.21281 10.6313 3.36871 10.5 3.50003L3.75 10.25L1 11L1.75 8.25003L8.5 1.50003Z" stroke="white" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_197_8779">
                                    <rect width="12" height="12" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </Link>
                </div>

            </div>

            <div className={styles.line}></div>

            <div className={styles.mainContent}>
                <div>
                    <h4>Ubicación</h4>
                    <select name="localizacion" id="localizacion" className={styles.location} value={localizacionFichaje} onChange={handleChange}>
                        <option value="oficina">Oficina</option>
                        <option value="casa">Casa</option>
                        <option value="viaje">Viaje</option>
                    </select>
                </div>

                <div>
                    <h4>Hora Inicio Jornada</h4>
                    <div className={styles.inicio}>
                        <p>{parseHora(horaInicio) || '-'}</p>
                    </div>
                </div>

                <div>
                    <div>
                        <h4>Hora Prev Fin Jornada</h4>
                        <Tooltips infoText='Esta es la hora prevista a la que terminas tu jornada laboral. Puedes modificar esto desde tu perfil'>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.97506 9C6.15006 9 6.29806 8.9395 6.41906 8.8185C6.54006 8.6975 6.60039 8.54967 6.60006 8.375C6.59973 8.20034 6.53939 8.05234 6.41906 7.931C6.29873 7.80967 6.15073 7.74934 5.97506 7.75C5.79939 7.75067 5.65156 7.81117 5.53156 7.9315C5.41156 8.05184 5.35106 8.19967 5.35006 8.375C5.34906 8.55034 5.40956 8.69834 5.53156 8.819C5.65356 8.93967 5.80139 9 5.97506 9ZM5.52506 7.075H6.45006C6.45006 6.8 6.48139 6.58334 6.54406 6.425C6.60673 6.26667 6.78373 6.05 7.07506 5.775C7.29173 5.55834 7.46256 5.352 7.58756 5.156C7.71256 4.96 7.77506 4.72467 7.77506 4.45C7.77506 3.98334 7.60423 3.625 7.26256 3.375C6.92089 3.125 6.51673 3 6.05006 3C5.57506 3 5.18973 3.125 4.89406 3.375C4.5984 3.625 4.39206 3.925 4.27506 4.275L5.10006 4.6C5.14173 4.45 5.23556 4.2875 5.38156 4.1125C5.52756 3.9375 5.75039 3.85 6.05006 3.85C6.31673 3.85 6.51673 3.923 6.65006 4.069C6.78339 4.215 6.85006 4.37534 6.85006 4.55C6.85006 4.71667 6.80006 4.873 6.70006 5.019C6.60006 5.165 6.47506 5.30034 6.32506 5.425C5.95839 5.75 5.7334 5.99584 5.65006 6.1625C5.56673 6.32917 5.52506 6.63334 5.52506 7.075ZM6.00006 11C5.30839 11 4.6584 10.8688 4.05006 10.6065C3.44173 10.3442 2.91256 9.98784 2.46256 9.5375C2.01256 9.08717 1.6564 8.558 1.39406 7.95C1.13173 7.342 1.0004 6.692 1.00006 6C0.999728 5.308 1.13106 4.658 1.39406 4.05C1.65706 3.442 2.01323 2.91284 2.46256 2.4625C2.9119 2.01217 3.44106 1.656 4.05006 1.394C4.65906 1.132 5.30906 1.00067 6.00006 1C6.69106 0.999336 7.34106 1.13067 7.95006 1.394C8.55906 1.65734 9.08823 2.0135 9.53756 2.4625C9.9869 2.9115 10.3432 3.44067 10.6066 4.05C10.8699 4.65934 11.0011 5.30934 11.0001 6C10.9991 6.69067 10.8677 7.34067 10.6061 7.95C10.3444 8.55934 9.98823 9.0885 9.53756 9.5375C9.0869 9.9865 8.55773 10.3428 7.95006 10.6065C7.34239 10.8702 6.69239 11.0013 6.00006 11Z" fill="#285FF5" />
                            </svg>
                        </Tooltips>

                    </div>
                    <div className={styles.final}>
                        <p>{parseHora(horaFinalAprox) || '-'}</p>
                    </div>
                </div>
            </div>


        </div>
    );
}