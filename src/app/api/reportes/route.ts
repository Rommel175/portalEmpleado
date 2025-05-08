import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (!user || error) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    /*const option = req.nextUrl.searchParams.get('option');
    const startDate = req.nextUrl.searchParams.get('startDate');
    const endDate = req.nextUrl.searchParams.get('endDate');
    const reciente = req.nextUrl.searchParams.get('reciente');
    const localizacion = req.nextUrl.searchParams.get('localizacion');*/
    const checkedState = JSON.parse(req.nextUrl.searchParams.get('checkedState') || '{}');


    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id);

    if (errorProfile) {
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }

    const date = new Date();
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5);
    endOfWeek.setHours(0, 0, 0, 0);

    let totalHoras = 0;
    let horasEquipo = 0;
    const users = [];

    const selectedProfiles = Object.keys(checkedState)
        .filter((key) => checkedState[parseInt(key)])
        .map((key) => parseInt(key));

    const showProfiles = selectedProfiles.length === 0 ? dataProfile : dataProfile.filter((profile) =>
        selectedProfiles.includes(profile.id)
    );

    for (const profile of showProfiles) {
        let totalHorasPerfil = 0;
        horasEquipo += profile.horas_semana;

        const { data: dataFichaje, error: errorFichaje } = await supabase
            .from('fichaje_jornada')
            .select('*')
            .eq('profile_id', profile.id)
            .gte('date', startOfWeek.toISOString())
            .lt('date', endOfWeek.toISOString());

        if (errorFichaje) {
            return NextResponse.json({ error: errorFichaje }, { status: 500 });
        }

        //let totalHorasNetas = 0;    

        if (dataFichaje && dataFichaje.length > 0) {
            for (const jornada of dataFichaje) {
                const { data: eventos, error: errorEventos } = await supabase
                    .from('fichaje_eventos')
                    .select('evento, date')
                    .eq('fichaje_id', jornada.id)
                    .order('date', { ascending: true });

                if (errorEventos) {
                    return NextResponse.json({ error: errorEventos }, { status: 500 })
                }

                let totalHorasTrabajadas = 0;
                let jornadaInicio: Date | null = null;
                let pausaInicio: Date | null = null;
                let totalPausas = 0;

                for (const evento of eventos || []) {
                    const hora = new Date(evento.date);

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
                                const duracionPausa = (hora.getTime() - pausaInicio.getTime()) / 1000 / 60 / 60;
                                totalPausas += duracionPausa;
                                pausaInicio = null;
                            }
                            break;
                        case 'Jornada Finalizada':
                            if (jornadaInicio) {
                                const duracionJornada = (hora.getTime() - jornadaInicio.getTime()) / 1000 / 60 / 60;
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
                    totalHorasPerfil += totalHorasTrabajadas
                }
            }
        }

        const horasRestantes = profile.horas_semana - totalHorasPerfil;

        users.push({
            id: profile.id,
            nombre: profile.nombre,
            apellido: profile.apellido,
            email: profile.email,
            image: profile.image,
            horas_semanales: formatHoras(profile.horas_semana),
            horas_restantes: formatHoras(parseFloat(horasRestantes.toFixed(2)))
        });
    }

    function formatHoras(horasDecimales: number): string {
        const horas = Math.floor(horasDecimales);
        const minutos = Math.round((horasDecimales - horas) * 60);
        return `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}`;
    }

    return NextResponse.json({ success: true, users: users, totalHoras: totalHoras, horasEquipo: horasEquipo });

}