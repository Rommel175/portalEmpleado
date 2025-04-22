import ContainerOptions from '@/components/containers/ContainerOptions'
import styles from './gestion.module.css'
import EquipoAdmin from '@/components/recursos/gestion/Equipo';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function GestionPage() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
        redirect('/login')
    }

    const { data: dataEquipo, error: errorEquipo } = await supabase
        .from('profiles')
        .select('id, nombre, apellido, email, image, estado, horas_semana, fichaje_jornada(id, date, date_final_aprox,total_trabajado, comentario, profile_id, fichaje_eventos(*))')
        .neq('user_id', user.id);

    if (errorEquipo) {
        console.log('Error equipo: ', errorEquipo);
    }

    const equipo = dataEquipo && dataEquipo.length > 0 ? dataEquipo : [];


    return (
        <div className={styles.container}>
            <ContainerOptions exportar={false} tipoRegistro={false} ubicacion={false} />
            <EquipoAdmin equipo={equipo}/>
        </div>
    );
}