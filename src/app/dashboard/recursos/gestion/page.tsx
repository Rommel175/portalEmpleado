'use client';

import { useEffect, useState } from 'react';;
import ContainerOptions from '@/components/containers/ContainerOptions';
import styles from './gestion.module.css';
import EquipoAdmin from '@/components/recursos/gestion/Equipo';
import { createClient } from '@/utils/supabase/client';
import { Equipo } from '@/types/Types';

export default function GestionPage() {
    const [equipo, setEquipo] = useState<Equipo[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [option, setOption] = useState('Esta semana');
    const [localizacion, setLocalizacion] = useState('all');
    const [reciente, setReciente] = useState(true);

    useEffect(() => {
        const fetchEquipo = async () => {
            const supabase = createClient();
            const { data: userData } = await supabase.auth.getUser();
            const user = userData?.user;

            const { data: dataEquipo, error: errorEquipo } = await supabase
                .from('profiles')
                .select(`
          id, nombre, apellido, email, image, estado, horas_semana,
          fichaje_jornada(id, date, date_final_aprox, total_trabajado, comentario, profile_id, fichaje_eventos(*))
        `)
                .neq('user_id', user?.id);

            if (errorEquipo) {
                console.log('Error equipo: ', errorEquipo);
                return;
            }

            setEquipo(dataEquipo || []);
        };

        fetchEquipo();
    }, []);

    return (
        <div className={styles.container}>
            <ContainerOptions ubicacion={false}
                urlExportar={'#'}
                usuarios={false}
                añadirUsuario={false}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                option={option}
                setOption={setOption}
                localizacion={localizacion}
                setLocalizacion={setLocalizacion}
                reciente={reciente}
                setReciente={setReciente} />
            <EquipoAdmin equipo={equipo} />
        </div>
    );
}
