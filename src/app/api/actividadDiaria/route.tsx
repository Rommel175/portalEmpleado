import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (!user || error) {
        console.log('Error 1', error);
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const now = dayjs();
    //const start = now.day(1).startOf('day');
    //const end = now.day(1).add(5, 'day').endOf('day');
    const start = now.startOf('day');
    const end = now.endOf('day');

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);
        //.single();

    if (errorProfile || !dataProfile) {
        return NextResponse.json({ error: errorProfile || 'Perfil no encontrado' }, { status: 500 });
    }

    //const profile = dataProfile;

    const horasSemana = dayjs.duration(dataProfile[0].horas_semana / 5, 'hours');
    let totalHorasPerfil = dayjs.duration(0);

    const { data: dataFichaje, error: errorFichaje } = await supabase
        .from('fichaje_jornada')
        .select('*')
        .eq('profile_id', dataProfile[0].id)
        .gte('date', start.toISOString())
        .lt('date', end.toISOString())
        .order('date', { ascending: true });

    if (errorFichaje) {
        console.log('Error 2', errorFichaje);
        return NextResponse.json({ error: errorFichaje }, { status: 500 });
    }

    for (const jornada of dataFichaje || []) {
        const { data: eventos, error: errorEventos } = await supabase
            .from('fichaje_eventos')
            .select('evento, date, id, modificado')
            .eq('fichaje_id', jornada.id)
            .order('date', { ascending: true });

        if (errorEventos) {
            console.log('Error 3', errorEventos);
            return NextResponse.json({ error: errorEventos }, { status: 500 });
        }

        let jornadaInicio: dayjs.Dayjs | null = null;
        let pausaInicio: dayjs.Dayjs | null = null;
        let tiempoPausa = dayjs.duration(0);

        for (const evento of eventos || []) {
            let hora;

            if (evento.modificado) {
                const { data: modificacionesData, error: errorModificacionesData } = await supabase
                    .from('modificaciones_eventos')
                    .select('fecha_modificada')
                    .eq('fichaje_evento_id', evento.id)
                    .order('created_at', { ascending: false });

                if (errorModificacionesData) {
                    console.log('Error 4', errorModificacionesData);
                    return NextResponse.json({ error: errorModificacionesData }, { status: 500 });
                }

                hora = dayjs(modificacionesData[0].fecha_modificada);
            } else {
                hora = dayjs(evento.date);
            }

            switch (evento.evento) {
                case 'Inicio Jornada':
                    jornadaInicio = hora;
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
                        const jornadaNetaSegundos = jornadaSegundos - tiempoPausa.asSeconds();
                        const jornadaNeta = dayjs.duration(jornadaNetaSegundos, 'second');
                        totalHorasPerfil = totalHorasPerfil.add(jornadaNeta);

                        jornadaInicio = null;
                        pausaInicio = null;
                        tiempoPausa = dayjs.duration(0);
                    }
                    break;
            }
        }
    }

    const horasRestantes = horasSemana.subtract(totalHorasPerfil);
    const minutosRestantes = Math.max(0, Math.round(horasRestantes.asMinutes()));
    const minutosTrabajados = Math.round(totalHorasPerfil.asMinutes());

    function formatTime(tiempoTotal: number) {
        const horas = Math.floor(tiempoTotal / 60);
        const minutos = tiempoTotal % 60;
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    }

    console.log(formatTime(minutosTrabajados))
    console.log(formatTime(minutosRestantes))
    console.log(horasRestantes.asHours())
    console.log(horasSemana.asHours())

    return NextResponse.json({
        success: true,
        minutosEsperados: Math.round(horasSemana.asMinutes()),
        minutosRestantes,
        minutosTrabajados
        
    }, { status: 200 });
}
