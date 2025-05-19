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

    const option = req.nextUrl.searchParams.get('option');
    const startDate = req.nextUrl.searchParams.get('startDate');
    const endDate = req.nextUrl.searchParams.get('endDate');
    const reciente = req.nextUrl.searchParams.get('reciente');
    const localizacion = req.nextUrl.searchParams.get('localizacion');
    const profileId = req.nextUrl.searchParams.get('profileId');

    function rangosPresets() {
        let start = dayjs();
        let end = dayjs();

        switch (option) {
            case 'Esta semana':
                const now = dayjs();
                start = now.day(1).startOf('day');
                end = now.day(1).add(5, 'day').endOf('day');
                ;
                break;
            case 'Hoy':
            case 'Ayer':
                if (!startDate) return [start, end];
                start = dayjs(startDate).startOf('day');
                end = start.endOf('day');
                break;
            case 'Semana pasada':
            case 'Este mes':
            case 'Mes pasado':
            case 'Este año':
            case 'Año pasado':
                start = dayjs(startDate).startOf('day');
                end = dayjs(endDate).endOf('day');
                break;
        }

        return [start, end];
    }

    const [start, end] = rangosPresets();

    //let horasEquipo = 0;

    let totalHoras = dayjs.duration(0);


    const { data: dataFichaje, error: errorFichaje } = await supabase
        .from('fichaje_jornada')
        .select('*')
        .eq('profile_id', profileId)
        .gte('date', start.toISOString())
        .lt('date', end.toISOString())
        .order('date', { ascending: !reciente });;

    //console.log(dataFichaje);

    if (errorFichaje) {
        return NextResponse.json({ error: errorFichaje }, { status: 500 });
    }

    if (dataFichaje && dataFichaje.length > 0) {
        for (const jornada of dataFichaje) {

            if (localizacion == 'all') {
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
                //let totalTiempoTrabajado = dayjs.duration(0);
                //let tiempoNeto = dayjs.duration(0);

                for (const evento of eventos || []) {
                    const hora = dayjs(evento.date);
                    //console.log(hora.format('HH:mm'))

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
                                totalHoras = totalHoras.add(jornadaNetaSegundos, 'second');

                                jornadaInicio = null;
                                pausaInicio = null;
                                tiempoPausa = dayjs.duration(0);
                            }
                            break;
                    }
                }
            } else {
                const { data: eventos, error: errorEventos } = await supabase
                    .from('fichaje_eventos')
                    .select('evento, date')
                    .eq('fichaje_id', jornada.id)
                    .eq('localizacion', localizacion)
                    .order('date', { ascending: true });

                if (errorEventos) {
                    return NextResponse.json({ error: errorEventos }, { status: 500 });
                }

                let jornadaInicio: dayjs.Dayjs | null = null;
                let pausaInicio: dayjs.Dayjs | null = null;
                let tiempoPausa = dayjs.duration(0);
                //let totalTiempoTrabajado = dayjs.duration(0);
                //let tiempoNeto = dayjs.duration(0);

                for (const evento of eventos || []) {
                    const hora = dayjs(evento.date);
                    //console.log(hora.format('HH:mm'))

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
                                totalHoras = totalHoras.add(jornadaNetaSegundos, 'second');

                                jornadaInicio = null;
                                pausaInicio = null;
                                tiempoPausa = dayjs.duration(0);
                            }
                            break;
                    }
                }
            }
        }

    }

    function formatTime(tiempoTotal: number) {
        const totalMinutos = Math.round(tiempoTotal);
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;

        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`
    }

    return NextResponse.json({
        success: true,
        totalHoras: formatTime(totalHoras.asMinutes()),
    }, { status: 200 });


}
