'use client';

import { useEffect, useState } from 'react';;
import ContainerOptions from '@/components/containers/ContainerOptions';
import styles from './gestion.module.css';
import EquipoAdmin from '@/components/recursos/gestion/Equipo';
import { createClient } from '@/utils/supabase/client';
import { Equipo } from '@/types/Types';
import { useRouter } from 'next/navigation';

export default function GestionPage() {
    const [equipo, setEquipo] = useState<Equipo[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [option, setOption] = useState('Esta semana');
    const [localizacion, setLocalizacion] = useState('all');
    const [reciente, setReciente] = useState(true);
    const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.auth.getUser();
            const user = data?.user;
            if (!user) {
                await supabase.auth.signOut();
                router.push('/')
            }
            const { data: dataEquipo, error: errorEquipo } = await supabase
                .from('profiles')
                .select('id, nombre, apellido, email, image, estado, horas_semana, fichaje_jornada(id, date, date_final_aprox,total_trabajado, comentario, profile_id, fichaje_eventos(*))')
                .neq('user_id', user?.id);

            if (errorEquipo) {
                console.log('Error fetching Equipo: ', errorEquipo);
            }

            if (dataEquipo && dataEquipo.length > 0) {
                setEquipo(dataEquipo);
                
            }
        }

        fetchData();

    }, [])


    return (
        <div className={styles.container}>
            <ContainerOptions añadirUsuario={true} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} option={option} setOption={setOption} localizacion={localizacion} setLocalizacion={setLocalizacion} reciente={reciente} setReciente={setReciente} checkedState={checkedState} setCheckedState={setCheckedState}/>
            <EquipoAdmin equipo={equipo} />
        </div>
    );
}
