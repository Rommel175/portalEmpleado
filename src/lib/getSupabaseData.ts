import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import dayjs from 'dayjs';

export async function getUserData() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.provider_token;

    if (!user) {
        redirect('/login')
    }

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

    if (errorProfile) {
        console.log('Error fetching profiles: ', errorProfile);
    }

    if (!dataProfile || dataProfile.length == 0) {
        await supabase.auth.signOut();
        redirect('/login');
    }

    const profile = dataProfile;

    const date = dayjs();
    const startDate = date.startOf('day');
    const endDate = startDate.add(1, 'day');


    const { data: dataFichaje, error: errorFichaje } = await supabase
        .from('fichaje_jornada')
        .select('*')
        .gte('date', startDate.toISOString())
        .lt('date', endDate.toISOString())
        .eq('profile_id', profile[0].id);

    if (errorFichaje) {
        console.error('Error fetching fichaje:', errorFichaje);
    }

    const fichaje = dataFichaje && dataFichaje.length > 0 ? dataFichaje : [];

    let eventos = [];

    if (fichaje && fichaje.length > 0) {
        const { data: dataEventos, error: errorEventos } = await supabase
            .from('fichaje_eventos')
            .select('*')
            .eq('fichaje_id', fichaje[0].id)

        if (errorEventos) {
            console.log('Error fetching Eventos: ', errorEventos);
        }

        eventos = dataEventos && dataEventos.length > 0 ? dataEventos : [];
    }

    const { data: dataEquipo, error: errorEquipo } = await supabase
        .from('profiles')
        .select('id, nombre, apellido, email, image, estado, horas_semana, fichaje_jornada(id, date, date_final_aprox,total_trabajado, comentario, profile_id, fichaje_eventos(*))')
        .neq('user_id', user.id);

    if (errorEquipo) {
        console.log('Error equipo: ', errorEquipo);
    }

    const equipo = dataEquipo && dataEquipo.length > 0 ? dataEquipo : [];

    //console.log(eventos)
    //console.log(eventos[eventos.length - 1])

    return {
        user,
        accessToken,
        profile: profile[0],
        fichaje,
        eventos,
        equipo
    }

}

export async function getTotalHoras() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
        redirect('/login')
    }

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

    if (errorProfile) {
        console.log('Error fetching profiles: ', errorProfile);
    }

    if (!dataProfile || dataProfile.length == 0) {
        await supabase.auth.signOut();
        redirect('/login');
    }

    const profile = dataProfile;

    let totalHoras = 0;

    const now = dayjs();
    const startOfWeek = now.day(1).startOf('day');
    const endOfWeek = now.day(1).add(5, 'day').endOf('day');


    const { data: dataFichaje, error: errorFichaje } = await supabase
        .from('fichaje_jornada')
        .select('*')
        .gte('date', startOfWeek.toISOString())
        .lt('date', endOfWeek.toISOString())
        .eq('profile_id', profile[0].id);

    if (errorFichaje) {
        console.error('Error fetching fichaje:', errorFichaje);
    }

    if (dataFichaje && dataFichaje.length > 0) {
        for (const jornada of dataFichaje) {
            const { data: eventos, error: errorEventos } = await supabase
                .from('fichaje_eventos')
                .select('evento, date')
                .eq('fichaje_id', jornada.id)
                .order('date', { ascending: true });

            if (errorEventos) {
                console.log('Error fetching eventos: ', errorEventos);
                continue;
            }

            let totalHorasTrabajadas = 0;
            let jornadaInicio = null;
            let pausaInicio = null;
            let totalPausas = 0;

            for (const evento of eventos || []) {
                const hora = dayjs(evento.date);

                switch (evento.evento) {
                    case 'Inicio Jornada':
                        jornadaInicio = hora;
                        totalPausas = 0;
                        pausaInicio = null;
                        break;
                    case 'Inicio Pausa':
                        if (jornadaInicio && !pausaInicio) {
                            pausaInicio = hora;
                        }
                        break;
                    case 'Fin Pausa':
                        if (jornadaInicio && pausaInicio) {
                            const duracionPausa = hora.diff(pausaInicio, 'hour', true);
                            totalPausas += duracionPausa;
                            pausaInicio = null;
                        }
                        break;
                    case 'Jornada Finalizada':
                        if (jornadaInicio) {
                            const duracionJornada = hora.diff(jornadaInicio, 'hour', true); 
                            const horasNetas = duracionJornada - totalPausas;
                            totalHorasTrabajadas += horasNetas;

                            jornadaInicio = null;
                            pausaInicio = null;
                            totalPausas = 0;
                        }
                        break;
                }
            }

            if (totalHorasTrabajadas > 0) {
                totalHoras += totalHorasTrabajadas;
            }
        }
    }

    return totalHoras;
}

export async function getUsersProfile(id: string) {
    const supabase = await createClient();
    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id);

    if (errorProfile) {
        console.log('Error fetching profile user: ', errorProfile);
    }

    const profile = dataProfile && dataProfile.length > 0 ? dataProfile : [];

    return profile[0]
}