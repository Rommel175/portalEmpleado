import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

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
        //.neq('user_id', user.id);

    if (errorProfile) {
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }

    const now = dayjs();

    const startOfWeek = now.day(1).startOf('day').toDate();
    const endOfWeek = now.day(1).add(5, 'day').endOf('day').toDate();

    //let totalHoras = 0;
    let totalHoras2 = dayjs.duration(0);

    let horasEquipo = 0;
    //let horasEquipo2 = dayjs.duration(0);

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
                    return NextResponse.json({ error: errorEventos }, { status: 500 });
                }

                let jornadaInicio: dayjs.Dayjs | null = null;
                let pausaInicio: dayjs.Dayjs | null = null;
                let tiempoPausa = dayjs.duration(0);
                let totalTiempoTrabajado = dayjs.duration(0);

                for (const evento of eventos || []) {
                    const hora = dayjs(evento.date);

                    switch (evento.evento) {
                        case 'Inicio Jornada':
                            jornadaInicio = hora;
                            //totalPausas = dayjs.duration(0);
                            pausaInicio = null;
                            break;
                        case 'Inicio Pausa':
                            if (jornadaInicio && !pausaInicio) {
                                pausaInicio = hora;
                            }
                            break;
                        case 'Fin Pausa':
                            if (jornadaInicio && pausaInicio) {
                                const pausaSegundos = hora.diff(pausaInicio, 'second');
                                tiempoPausa = tiempoPausa.add(pausaSegundos, 'second');
                                pausaInicio = null;
                            }
                            break;
                        case 'Jornada Finalizada':
                            if (jornadaInicio) {
                                const jornadaSegundos = hora.diff(jornadaInicio, 'second');
                                totalTiempoTrabajado = totalTiempoTrabajado.add(jornadaSegundos, 'second');
                                jornadaInicio = null;
                                totalHorasPerfil = totalTiempoTrabajado.subtract(tiempoPausa);
                            }
                            break;
                    }
                }

                //console.log('sssssssPERFILLLLssss',totalHorasPerfil.format('HH:mm:ss:SSS'))

            }
        }

        const horasSemana = dayjs.duration(profile.horas_semana, 'hours');
        const minutosSemana = Math.round(horasSemana.asMinutes());

        const horasRestantes2 = horasSemana.subtract(totalHorasPerfil);
        const minutosTotales = Math.round(horasRestantes2.asMinutes());

        users.push({
            id: profile.id,
            nombre: profile.nombre,
            apellido: profile.apellido,
            email: profile.email,
            image: profile.image,
            horas_semanales: formatTime(minutosSemana),
            horas_restantes: formatTime(minutosTotales)
        });

        totalHoras2 = totalHoras2.add(totalHorasPerfil);
    }

    //console.log(totalHoras2)
    const minutosHorasTotalesEquipo = Math.round(totalHoras2.asMinutes()); 

    console.log(formatTime(minutosHorasTotalesEquipo))

    function formatTime(tiempoTotal: number) {
        const horas = Math.floor(tiempoTotal / 60);
        const minutos = tiempoTotal % 60;

        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`
    }

    return NextResponse.json({
        success: true,
        users,
        totalHoras: formatTime(minutosHorasTotalesEquipo),
        horasEquipo
    });
}
