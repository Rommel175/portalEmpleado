'use client'

import { useEffect, useState } from "react";
import styles from './containerSuperior.module.css';
import ContainerDatos from "./datos/ContainerDatos";
import ContainerFichaje from "./fichaje/ContanerFichaje";
import { Fichaje_eventos, Fichaje_jornada, Profile } from "@/types/Types";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';


export default function ContainerSuperior({ profile, fichaje, eventos }: { profile: Profile, fichaje: Fichaje_jornada[], eventos: Fichaje_eventos[] }) {
    const [estado, setEstado] = useState(profile.estado ?? '');
    const [localizacionFichaje, setLocalizacionFichaje] = useState(eventos?.[eventos.length - 1]?.localizacion ?? 'oficina');
    const [horaInicio, setHoraInicio] = useState(fichaje?.[0]?.date ?? '');
    const [horaFinalAprox, setHoraFinalAprox] = useState(fichaje?.[0]?.date_final_aprox);
    const [idFichaje, setIdFichaje] = useState('');
    const supabase = createClient();

    useEffect(() => {
        const jornadaRealTime = supabase
            .channel('realtime-fichaje_jornada-contenedor_datos3')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'fichaje_jornada',
            }, (payload: RealtimePostgresChangesPayload<Fichaje_jornada>) => {
                switch (payload.eventType) {
                    case 'INSERT':
                        if (payload.new.profile_id !== profile.id) return;
                        const insertItem = payload.new;
                        setIdFichaje(insertItem.id)
                        break;
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(jornadaRealTime);
        };
    }, [])

    return (
        <div className={styles.containerSuperior}>
            <ContainerDatos estado={estado} localizacionFichaje={localizacionFichaje} setLocalizacionFichaje={setLocalizacionFichaje} horaInicio={horaInicio} setHoraInicio={setHoraInicio} setHoraFinalAprox={setHoraFinalAprox} horaFinalAprox={horaFinalAprox} profile={profile} idFichaje={idFichaje} setIdFichaje={setIdFichaje} />
            <ContainerFichaje profile={profile} estado={estado} setEstado={setEstado} localizacionFichaje={localizacionFichaje} />
        </div>
    );
}
