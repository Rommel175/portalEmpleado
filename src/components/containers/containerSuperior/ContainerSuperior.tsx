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
    const supabase = createClient();

    useEffect(() => {

        const jornadaRealTime = supabase
            .channel('realtime-fichaje_jornada-contenedor_datos3')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'fichaje_jornada',
            }, async (payload: RealtimePostgresChangesPayload<Fichaje_jornada>) => {

                const fetchData = async (id: string) => {
                    const { data, error } = await supabase
                        .from('fichaje_eventos')
                        .select('localizacion')
                        .eq('fichaje_id', id)
                        .order('date', { ascending: false })
                        .limit(1);

                    if (error) {
                        console.log('Error fetching Data', error);
                    }

                    if (data && data.length > 0) {
                        setLocalizacionFichaje(data[0].localizacion);
                    }
                }

                switch (payload.eventType) {
                    case 'INSERT':
                        const insertItem = payload.new;
                        console.log('Insert', insertItem);
                        if (insertItem.profile_id !== profile.id) return;
                        fetchData(insertItem.id);
                        setHoraInicio(insertItem.date);
                        setHoraFinalAprox(insertItem.date);
                        break;
                    case 'UPDATE':
                        const updatedItem = payload.new;
                        if (updatedItem.profile_id !== profile.id) return;
                        setHoraInicio(updatedItem.date);
                        setHoraFinalAprox(updatedItem.date);
                        fetchData(updatedItem.id);
                        break;
                }
            })
            .subscribe();

        /*const eventosRealTime = supabase
            .channel('realtime-fichaje_jornada-contenedor_datos3')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'fichaje_eventos',
            }, async (payload: RealtimePostgresChangesPayload<Fichaje_eventos>) => {

                const fetchData = async (fichaje_id: string) => {
                    const { data: jornadaData, error: jornadaError } = await supabase
                        .from('fichaje_jornada')
                        .select('profile_id')
                        .eq('id', fichaje_id)
                        .single();

                    if (jornadaError) {
                        console.error('Error buscando jornada', jornadaError);
                        return;
                    }

                    if (jornadaData?.profile_id !== profile.id) {
                        return;
                    }

                    const { data, error } = await supabase
                        .from('fichaje_eventos')
                        .select('localizacion')
                        .eq('fichaje_id', fichaje_id)
                        .order('date', { ascending: false })
                        .limit(1);

                    if (error) {
                        console.error('Error obteniendo localización', error);
                        return;
                    }

                    if (data && data.length > 0) {
                        setLocalizacionFichaje(data[0].localizacion);
                    }
                };

                switch (payload.eventType) {
                    case 'INSERT':
                        const insertItem = payload.new;
                        console.log('Insert', insertItem);
                        if (!insertItem.fichaje_id) return;
                        fetchData(insertItem.fichaje_id);
                        break;
                    case 'UPDATE':
                        const updatedItem = payload.new;
                        if (!updatedItem.fichaje_id) return;
                        fetchData(updatedItem.fichaje_id);
                        break;
                }
            })
            .subscribe();*/

        return () => {
            supabase.removeChannel(jornadaRealTime);
            //supabase.removeChannel(eventosRealTime);
        };
    }, []);

    useEffect(() => {
        console.log('localizacionFichaje', localizacionFichaje);
    }, [localizacionFichaje])

    return (
        <div className={styles.containerSuperior}>
            <ContainerDatos estado={estado} localizacionFichaje={localizacionFichaje} setLocalizacionFichaje={setLocalizacionFichaje} horaInicio={horaInicio} setHoraInicio={setHoraInicio} setHoraFinalAprox={setHoraFinalAprox} horaFinalAprox={horaFinalAprox} profile={profile} />
            <ContainerFichaje profile={profile} estado={estado} setEstado={setEstado} localizacionFichaje={localizacionFichaje} />
        </div>
    );
}
