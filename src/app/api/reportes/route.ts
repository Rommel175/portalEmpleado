import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from 'dayjs';
import duration, { Duration } from 'dayjs/plugin/duration';

dayjs.extend(duration);

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (!user || error) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const checkedState = JSON.parse(req.nextUrl.searchParams.get('checkedState') || '{}');

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id);

    if (errorProfile) {
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }

    const today = dayjs();
    const startOfWeek = today.startOf('week').add(1, 'day').hour(0).minute(0).second(0).millisecond(0);
    const endOfWeek = startOfWeek.add(5, 'day');

    let totalHoras = 0;
    let horasEquipo = 0;
    const users = [];

    const selectedProfiles = Object.keys(checkedState)
        .filter((key) => checkedState[parseInt(key)])
        .map((key) => parseInt(key));

    const showProfiles = selectedProfiles.length === 0
        ? dataProfile
        : dataProfile.filter((profile) => selectedProfiles.includes(profile.id));

    for (const profile of showProfiles) {
        let totalHorasPerfil = dayjs.duration(0);
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

                let jornadaInicio: dayjs.Dayjs | null = null;
                let pausaInicio: dayjs.Dayjs | null = null;
                let totalPausas = dayjs.duration(0);

                for (const evento of eventos || []) {
                    const hora = dayjs(evento.date);

                    switch (evento.evento) {
                        case 'Inicio Jornada':
                            jornadaInicio = hora;
                            totalPausas = dayjs.duration(0);
                            pausaInicio = null;
                            break;
                        case 'Inicio Pausa':
                            if (jornadaInicio && !pausaInicio) {
                                pausaInicio = hora;
                            }
                            break;
                        case 'Fin Pausa':
                            if (jornadaInicio && pausaInicio) {
                                totalPausas = totalPausas.add(dayjs.duration(hora.diff(pausaInicio)));
                                pausaInicio = null;
                            }
                            break;
                        case 'Jornada Finalizada':
                            if (jornadaInicio) {
                                const duracionJornada = dayjs.duration(hora.diff(jornadaInicio));
                                const horasNetas = duracionJornada.subtract(totalPausas);
                                totalHorasPerfil = totalHorasPerfil.add(horasNetas);
                                jornadaInicio = null;
                                pausaInicio = null;
                                totalPausas = dayjs.duration(0);
                            }
                            break;
                    }
                }
            }
        }

        const horasSemana = dayjs.duration(profile.horas_semana, 'hours');
        const horasUsadas = totalHorasPerfil;
        const horasRestantes = horasSemana.subtract(horasUsadas);

        users.push({
            id: profile.id,
            nombre: profile.nombre,
            apellido: profile.apellido,
            email: profile.email,
            image: profile.image,
            horas_semanales: formatHoras(horasSemana),
            horas_restantes: formatHoras(horasRestantes)
        });

        totalHoras += totalHorasPerfil.asHours();
    }

    function formatHoras(dur: Duration): string {
        const totalMinutos = Math.round(dur.asMinutes());
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60
        return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
    }

    return NextResponse.json({
        success: true,
        users,
        totalHoras: parseFloat(totalHoras.toFixed(2)),
        horasEquipo
    });
}
