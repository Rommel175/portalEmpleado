'use client'

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';
import styles from './containerSuperior.module.css';
import ContainerDatos from "./datos/ContainerDatos";
import ContainerFichaje from "./fichaje/ContanerFichaje";


export default function ContainerSuperior({ user }: { user: User }) {
    const [estado, setEstado] = useState('');
    //const [eventoFichaje, setEventoFichaje] = useState('');
    const [localizacionFichaje, setLocalizacionFichaje] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFinalAprox, setHoraFinalAprox] = useState('');

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            const { data, error } = await supabase
                .from('fichaje_jornada')
                .select('id, hora_aprox_salida')
                .eq('user_id', user.id)
                .eq('created_at', `${year}-${month}-${day}`);

            if (error) {
                console.log('Error fetching fichaje: ', error);
            }

            if (data && data.length > 0) {
                const fichajeId = data[0].id;
                setHoraFinalAprox(data[0].hora_aprox_salida);

                const { data: dataFichajeEvent, error: errorFichajeEvent } = await supabase
                    .from('fichaje_eventos')
                    .select('hora, localizacion')
                    .eq('fichaje_id', fichajeId);

                if (errorFichajeEvent) {
                    console.log('Error fetching Fichaje Evento: ', errorFichajeEvent)
                }

                if (dataFichajeEvent && dataFichajeEvent.length > 0) {
                    setLocalizacionFichaje(dataFichajeEvent[0].localizacion);
                    setHoraInicio(dataFichajeEvent[0].hora);
                    //setEventoFichaje(dataFichajeEvent[0].evento)
                }
            }

            const { data: dataEstado, error: errorEstado } = await supabase
                .from('profiles')
                .select('estado')
                .eq('user_id', user.id)

            if (errorEstado) {
                console.log('Error fetching Estado: ', errorEstado)
            }

            if (dataEstado && dataEstado.length > 0) {
                setEstado(dataEstado[0].estado);
            } else {
                console.log('undefined')
            }
        }

        fetchData();
    }, [])

    return (
        <div className={styles.containerSuperior}>
            <ContainerDatos user={user} estado={estado} localizacionFichaje={localizacionFichaje} setLocalizacionFichaje={setLocalizacionFichaje} horaInicio={horaInicio} horaFinalAprox={horaFinalAprox} /*eventoFichaje={eventoFichaje} setEventoFichaje={setEventoFichaje}*/ />
            <ContainerFichaje user={user} estado={estado} setEstado={setEstado} localizacionFichaje={localizacionFichaje} /*eventoFichaje={eventoFichaje} setEventoFichaje={setEventoFichaje}*/ />
        </div>
    );
}
