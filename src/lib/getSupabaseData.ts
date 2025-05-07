import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const startDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);

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

    const date = new Date();
    const startOfWeek = new Date(date);
    const dayCard = startOfWeek.getDay();
    const diffToMonday = dayCard === 0 ? -6 : 1 - dayCard;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5);
    endOfWeek.setHours(0, 0, 0, 0);

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

            let trabajandoDesde: Date | null = null;
            let enPausaDesde: Date | null = null;
            let tiempoJornada = 0; // en horas
            let tiempoPausa = 0;

            for (const evento of eventos || []) {
                const hora = new Date(evento.date);

                switch (evento.evento) {
                    case 'Inicio Jornada':
                        if (!trabajandoDesde) trabajandoDesde = hora;
                        break;

                    case 'Inicio Pausa':
                        if (trabajandoDesde && !enPausaDesde) {
                            enPausaDesde = hora;
                        }
                        break;

                    case 'Final Pausa':
                        if (enPausaDesde) {
                            tiempoPausa += (hora.getTime() - enPausaDesde.getTime()) / 1000 / 60 / 60;
                            enPausaDesde = null;
                        }
                        break;

                    case 'Jornada Finalizada':
                        if (trabajandoDesde) {
                            const duracion = (hora.getTime() - trabajandoDesde.getTime()) / 1000 / 60 / 60;
                            tiempoJornada += duracion;
                            trabajandoDesde = null;
                            tiempoJornada -= tiempoPausa;
                            tiempoPausa = 0;
                        }
                        break;
                }
            }

            if (tiempoJornada > 0) {
                totalHoras += tiempoJornada;
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