'use client'

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';
import styles from './containerSuperior.module.css';
import ContainerDatos from "./datos/ContainerDatos";
import ContainerFichaje from "./fichaje/ContanerFichaje";


export default function ContainerSuperior({ user }: { user: User }) {
    const [estado, setEstado] = useState('');
    const [localizacionFichaje, setLocalizacionFichaje] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFinalAprox, setHoraFinalAprox] = useState('');

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: dataProfile, error: errorProfile } = await supabase
                .from('profiles')
                .select('id, estado')
                .eq('user_id', user.id);

            if (errorProfile) {
                console.log('Error fetching Profile: ', errorProfile)
            }

            if (dataProfile && dataProfile.length > 0) {
                setEstado(dataProfile[0].estado);
                const date = new Date();
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();

                const { data, error } = await supabase
                    .from('fichaje_jornada')
                    .select('id, hora_aprox_salida')
                    .eq('profile_id', dataProfile[0].id)
                    .eq('created_at', `${year}-${month}-${day}`);

                if (error) {
                    console.log('Error fetching fichaje: ', error);
                }

                if (data && data.length > 0) {
                    const fichajeId = data[0].id;
                    setHoraFinalAprox(data[0].hora_aprox_salida);

                    const { data: dataFichajeEvent, error: errorFichajeEvent } = await supabase
                        .from('fichaje_eventos')
                        .select('hora, localizacion, id')
                        .eq('fichaje_id', fichajeId);

                    if (errorFichajeEvent) {
                        console.log('Error fetching Fichaje Evento: ', errorFichajeEvent)
                    }

                    if (dataFichajeEvent && dataFichajeEvent.length > 0) {
                        setLocalizacionFichaje(dataFichajeEvent[dataFichajeEvent.length - 1].localizacion);
                        setHoraInicio(dataFichajeEvent[0].hora);
                        //console.log("Último evento:", dataFichajeEvent[dataFichajeEvent.length - 1].id);

                    }
                }

            }
        }

        fetchData();
    }, [])

    return (
        <div className={styles.containerSuperior}>
            <ContainerDatos user={user} estado={estado} localizacionFichaje={localizacionFichaje} setLocalizacionFichaje={setLocalizacionFichaje} horaInicio={horaInicio} horaFinalAprox={horaFinalAprox} />
            <ContainerFichaje user={user} estado={estado} setEstado={setEstado} localizacionFichaje={localizacionFichaje} />
        </div>
    );
}
