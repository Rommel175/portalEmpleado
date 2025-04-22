import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import styles from './comentarios.module.css';
import ComentarioContainer from "@/components/recursos/comentarios/ComentarioContainer";

type FichajeComentario = {
    fecha: string | Date;
    comentario: string;
};

type UserData = {
    id: string;
    nombre: string;
    apellido: string;
    fichajes: FichajeComentario[];
};

export default async function ComentariosPage() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
        redirect('/login');
    }

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        //.neq('user_id', user.id);

    if (errorProfile) {
        console.log('Error fetching profiles: ', errorProfile);
    }

    const profiles = dataProfile || [];

    if (profiles.length === 0) {
        await supabase.auth.signOut();
        redirect('/login');
    }

    const usersData: UserData[] = [];

    for (const profile of profiles) {
        const { data: fichajeJornada, error: errorFichajeJornada } = await supabase
            .from('fichaje_jornada')
            .select('*')
            .eq('profile_id', profile.id)
            .not('comentario', 'is', null)
            .neq('comentario', '');

        if (errorFichajeJornada) {
            console.log('Error fetching Fichajes Jornada: ', errorFichajeJornada);
        }

        if (fichajeJornada && fichajeJornada.length > 0) {
            usersData.push({
                id: profile.id,
                nombre: profile.nombre,
                apellido: profile.apellido,
                fichajes: fichajeJornada.map(item => ({
                    fecha: item.fecha,
                    comentario: item.comentario,
                })),
            });
        }
    }



    return (
        <div className={styles.container}>
            {
                JSON.stringify(usersData)
            }
            
            <ComentarioContainer />
        </div>
    );
}