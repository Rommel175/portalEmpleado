'use client'

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';
import styles from './containerSuperior.module.css';
import ContainerDatos from "./datos/ContainerDatos";
import ContainerFichaje from "./fichaje/ContanerFichaje";


export default function ContainerSuperior({ user }: { user: User }) {
    const [estado, setEstado] = useState('');
    const [localizacion, setLocalizacion] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFinalAprox, setHoraFinalAprox] = useState('');

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const mounth = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            const { data, error } = await supabase
                .from('historialFichajes')
                .select('localizacionFichaje, horaEntrada, horaAproxSalida')
                .eq('created_at', `${year}-${mounth}-${day}`)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching fichaje:', error);
                return;
            }

            if (data && data.length > 0) {
                if (data[0].localizacionFichaje) {
                    setLocalizacion(data[0].localizacionFichaje);
                } else {
                    setLocalizacion('-');
                }

                if (data[0].horaEntrada) {
                    const horaEntradaSplit = data[0].horaEntrada.split(':');
                    setHoraInicio(`${horaEntradaSplit[0]}:${horaEntradaSplit[1]}`);
                } else {
                    setHoraInicio('-')
                }

                if (data[0].horaAproxSalida) {
                    const horaAproxSalidaSplit = data[0].horaAproxSalida.split(':');
                    setHoraFinalAprox(`${horaAproxSalidaSplit[0]}:${horaAproxSalidaSplit[1]}`)
                } else {
                    setHoraFinalAprox('-')
                }

                /*setHoraInicio(data[0].horaEntrada);
                setHoraFinalAprox(data[0].horaAproxSalida);*/

            } else {
                console.log('undefined')
            };

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
    }, []);

    return (
        <div className={styles.containerSuperior}>
            <ContainerDatos user={user} estado={estado} localizacion={localizacion} setLocalizacion={setLocalizacion} horaInicio={horaInicio} horaFinalAprox={horaFinalAprox} />
            <ContainerFichaje user={user} estado={estado} setEstado={setEstado} />
        </div>
    );
}
