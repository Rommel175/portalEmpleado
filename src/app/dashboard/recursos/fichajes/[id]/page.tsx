import ContainerOptions from "@/components/containers/ContainerOptions";
import EntradasFichajes from "@/components/containers/historialFichajes/EntradasFichajes";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HistorialFichaje({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const fechas: string[] = [];
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
        redirect('/login')
    }

    const { data: dataMainPofile, error: errorMainProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

    if (errorMainProfile) {
        console.log('Error fetching Main Porfile: ', errorMainProfile);
    }

    if (dataMainPofile && dataMainPofile.length > 0) {
        if (!dataMainPofile[0].is_admin) {
            redirect('/');
        }
    }

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
    
    let profile = []

    if (dataProfile && dataProfile.length > 0) {
        profile = dataProfile;
    }


    const { data: dataJornada, error: errorJornada } = await supabase
        .from('fichaje_jornada')
        .select('*')
        .eq('profile_id', profile[0].id)
        .order('date', { ascending: false });

    if (errorJornada) {
        console.log('Error fetching Jornada: ', errorJornada);
    }

    if (dataJornada && dataJornada.length > 0) {
        for (let i = 0; i < dataJornada.length; i++) {
            fechas.push(dataJornada[i].date);
        }
    }

    if (errorProfile) {
        console.log('Error fetching Profile: ', errorProfile)
    }

    return (
        <>
            <ContainerOptions urlExportar={'#'} usuarios={false} añadirUsuario={false} />
            {
                fechas.map((fecha) => {
                    return <EntradasFichajes key={fecha} date={fecha} profile={profile} />
                })
            }

        </>
    );
}