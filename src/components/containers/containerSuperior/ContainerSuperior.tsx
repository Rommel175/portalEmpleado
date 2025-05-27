'use client'

import { useEffect, useState } from "react";
import styles from './containerSuperior.module.css';
import ContainerDatos from "./datos/ContainerDatos";
import ContainerFichaje from "./fichaje/ContanerFichaje";
import { Fichaje_eventos, Fichaje_jornada, Profile } from "@/types/Types";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import dayjs from "dayjs";
dayjs.locale('es');

export default function ContainerSuperior({ profile/*, fichaje*/, eventos }: { profile: Profile, fichaje: Fichaje_jornada[], eventos: Fichaje_eventos[] }) {
    const [estado, setEstado] = useState(profile.estado ?? '');
    const [localizacionFichaje, setLocalizacionFichaje] = useState(eventos?.[eventos.length - 1]?.localizacion ?? 'oficina');
    //const [horaInicio, setHoraInicio] = useState(fichaje?.[0]?.date ?? '');
    const [horaInicio, setHoraInicio] = useState<Date | null>(null);
    const [horaFinalAprox, setHoraFinalAprox] = useState<Date | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const date = dayjs();
        const hoy = date.format('dddd').toLowerCase();

        const campo = `hora_fin_${hoy}` as keyof Profile;


        const horaAproxFin = profile[campo] as string | null;

        if (horaAproxFin) {
            setHoraFinalAprox(dayjs(horaAproxFin).toDate())
        } else {
            setHoraFinalAprox(null);
        }


        const fetchLocation = async () => {
            //const supabase = createClient();

            const { data: dataFichaje, error: errorFichaje } = await supabase
                .from('fichaje_jornada')
                .select('id')
                .eq('profile_id', profile.id)
                .gte('date', date.startOf('day').toISOString())
                .lt('date', date.endOf('day').toISOString());

            if (errorFichaje) {
                console.log('Error fetching fichaje: ', errorFichaje);
            }

            if (dataFichaje && dataFichaje.length > 0) {
                const { data: dataEventos, error: errorEventos } = await supabase
                    .from('fichaje_eventos')
                    .select('localizacion')
                    .eq('fichaje_id', dataFichaje[0].id)
                    .order('date', { ascending: false });

                if (errorEventos) {
                    console.log('Error fetching fichaje: ', errorEventos);
                }

                if (dataEventos && dataEventos.length > 0) {
                    setLocalizacionFichaje(dataEventos[0].localizacion);
                }
            }
        }

        fetchLocation();

        const fetchHoraInicio = async () => {
            const { data: dataFichaje, error: errorFichaje } = await supabase
                .from('fichaje_jornada')
                .select('id')
                .eq('profile_id', profile.id)
                .gte('date', date.startOf('day').toISOString())
                .lt('date', date.endOf('day').toISOString());

            if (errorFichaje) {
                console.log('Error fetching fichaje: ', errorFichaje);
            }

            if (dataFichaje && dataFichaje.length > 0) {
                const { data: dataEventos, error: errorEventos } = await supabase
                    .from('fichaje_eventos')
                    .select('*')
                    .eq('fichaje_id', dataFichaje[0].id)
                    .order('date', { ascending: true });

                if (errorEventos) {
                    console.log('Error fetching fichaje: ', errorEventos);
                }

                if (dataEventos && dataEventos.length > 0) {
                    if (dataEventos[0].modificado) {
                        const { data: modificacionesData, error: errorModificacionesData } = await supabase
                            .from('modificaciones_eventos')
                            .select('fecha_modificada')
                            .eq('fichaje_evento_id', dataEventos[0].id)
                            .order('created_at', { ascending: false })

                        if (errorModificacionesData) {
                            console.log('Error modificaciones data: ', errorModificacionesData);
                        }

                        setHoraInicio(modificacionesData?.[0]?.fecha_modificada)
                    } else {
                        setHoraInicio(dataEventos[0].date);
                    }
                }
            }
        }

        fetchHoraInicio();

    }, [])

    useEffect(() => {

        const jornadaRealTime = supabase
            .channel('realtime-fichaje_jornada-contenedor_datos3')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'fichaje_jornada',
            }, async (payload: RealtimePostgresChangesPayload<Fichaje_jornada>) => {

                const fetchLocation = async (id: string) => {
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
                        fetchLocation(insertItem.id);
                        setHoraInicio(insertItem.date);
                        setHoraFinalAprox(insertItem.date_final_aprox);
                        break;
                    case 'UPDATE':
                        const updatedItem = payload.new;
                        if (updatedItem.profile_id !== profile.id) return;
                        //setHoraInicio(updatedItem.date);
                        //setHoraFinalAprox(updatedItem.date_final_aprox);
                        fetchLocation(updatedItem.id);
                        break;
                }
            })
            .subscribe();

        const eventosRealTime = supabase //Posiblmnete noi haga falta
            .channel('realtime-fichaje_jornada-contenedor_datos6')
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
                        console.log('Insert', updatedItem);
                        if (!updatedItem.fichaje_id) return;
                        fetchData(updatedItem.fichaje_id);
                        break;
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(jornadaRealTime);
            supabase.removeChannel(eventosRealTime);
        };
    }, []);

    /*useEffect(() => {
        console.log('localizacionFichaje', localizacionFichaje);
    }, [localizacionFichaje])*/

    return (
        <div className={styles.containerSuperior}>
            <ContainerDatos estado={estado} localizacionFichaje={localizacionFichaje} setLocalizacionFichaje={setLocalizacionFichaje} horaInicio={horaInicio} setHoraFinalAprox={setHoraFinalAprox} horaFinalAprox={horaFinalAprox} profile={profile} />
            <ContainerFichaje profile={profile} estado={estado} setEstado={setEstado} localizacionFichaje={localizacionFichaje} />
        </div>
    );
}
