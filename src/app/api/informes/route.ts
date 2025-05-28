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
    const option = req.nextUrl.searchParams.get('option');
    const startDate = req.nextUrl.searchParams.get('startDate');
    const endDate = req.nextUrl.searchParams.get('endDate');
    const reciente = req.nextUrl.searchParams.get('reciente');

    let tituloHoras = '';

    switch (option) {
        case 'Hoy':
            tituloHoras = 'Horas diarias';
            break;
        case 'Ayer':
            tituloHoras = 'Horas diarias';
            break;
        case 'Esta semana':
            tituloHoras = 'Horas semanales';
            break;
        case 'Semana pasada':
            tituloHoras = 'Horas semanales';
            break;
        case 'Este mes':
            tituloHoras = 'Horas mensuales';
            break;
        case 'Mes pasado':
            tituloHoras = 'Horas mensuales';
            break;
        case 'Este año':
            tituloHoras = 'Horas anuales';
            break;
        case 'Año pasado':
            tituloHoras = 'Horas anuales';
            break;
        case '':
            tituloHoras = 'Horas';
            break;
        default:
            tituloHoras = 'Horas';
            break;
    }

    switch (option) {
        case 'Hoy':
    }

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
    //.eq('id', '18')

    if (errorProfile) {
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }

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

    /*const now = dayjs();

    const startOfWeek = now.day(1).startOf('day').toDate();
    const endOfWeek = now.day(1).add(5, 'day').endOf('day').toDate();*/

    let totalHoras = dayjs.duration(0);

    let horasEquipo = dayjs.duration(0);

    const users = [];

    const selectedProfiles = Object.keys(checkedState)
        .filter((key) => checkedState[parseInt(key)])
        .map((key) => parseInt(key));

    const showProfiles = selectedProfiles.length === 0
        ? dataProfile
        : dataProfile.filter((profile) => selectedProfiles.includes(profile.id));

    for (const profile of showProfiles) {
        let horasSemana;
        switch (option) {
            case 'Hoy':
            case 'Ayer':
                horasSemana = dayjs.duration((profile.horas_semana / 5), 'hours');
                break;
            case 'Esta semana':
            case 'Semana pasada':
                horasSemana = dayjs.duration(profile.horas_semana, 'hours');
                break;
            case 'Este mes':
            case 'Mes pasado':
                horasSemana = dayjs.duration((profile.horas_semana * 4), 'hours');
                break;
            case 'Este año':
            case 'Año pasado':
                horasSemana = dayjs.duration(((profile.horas_semana / 5) * 365), 'hours');
                break;
            default:
                horasSemana = dayjs.duration(profile.horas_semana, 'hours');
                break;
        }




        let totalHorasPerfil = dayjs.duration(0);
        horasEquipo = horasEquipo.add(horasSemana);

        const { data: dataFichaje, error: errorFichaje } = await supabase
            .from('fichaje_jornada')
            .select('*')
            .eq('profile_id', profile.id)
            .gte('date', start.toISOString())
            .lt('date', end.toISOString())
            .order('date', { ascending: !reciente });;

        //console.log(dataFichaje);

        if (errorFichaje) {
            return NextResponse.json({ error: errorFichaje }, { status: 500 });
        }

        if (dataFichaje && dataFichaje.length > 0) {
            for (const jornada of dataFichaje) {
                const { data: eventos, error: errorEventos } = await supabase
                    .from('fichaje_eventos')
                    .select('evento, date, id, modificado')
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
                    //const hora = dayjs(evento.date);

                    let hora;

                    if (evento.modificado) {
                        const { data: modificacionesData, error: errorModificacionesData } = await supabase
                            .from('modificaciones_eventos')
                            .select('fecha_modificada')
                            .eq('fichaje_evento_id', evento.id)
                            .order('created_at', { ascending: false })

                        if (errorModificacionesData) {
                            console.log('Error modificaciones data: ', errorModificacionesData);
                            return NextResponse.json({ error: errorModificacionesData }, { status: 500 })
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


                                //totalTiempoTrabajado = totalTiempoTrabajado.add(jornadaSegundos, 'second');
                                //tiempoNeto = totalTiempoTrabajado.subtract(tiempoPausa);

                                totalHorasPerfil = totalHorasPerfil.add(jornadaNeta);

                                jornadaInicio = null;
                                pausaInicio = null;
                                tiempoPausa = dayjs.duration(0);
                            }
                            break;
                    }
                }
            }
        }

        console.log('Horas trabajadas', formatTime(totalHorasPerfil.asMinutes()));
        console.log('Horas esperadas', horasSemana.asHours())
        console.log('Horas restantes:', formatTime(horasSemana.subtract(totalHorasPerfil).asMinutes()));

        const horasRestantes = horasSemana.subtract(totalHorasPerfil);
        const minutosTotales = Math.round(horasRestantes.asMinutes());
        const minutosTrabajados = Math.round(totalHorasPerfil.asMinutes());

        users.push({
            id: profile.id,
            nombre: profile.nombre,
            apellido: profile.apellido,
            email: profile.email,
            image: profile.image,
            horas_semanales: formatTime(horasSemana.asMinutes()),
            horas_restantes: formatTime(minutosTotales),
            horas_trabajadas: formatTime(minutosTrabajados)
        });

        totalHoras = totalHoras.add(totalHorasPerfil);
    }

    const minutosHorasTotalesEquipo = Math.round(totalHoras.asMinutes());

    //console.log(formatTime(minutosHorasTotalesEquipo))

    function formatTime(tiempoTotal: number) {
        const horas = Math.floor(tiempoTotal / 60);
        const minutos = tiempoTotal % 60;

        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`
    }

    const minutosEquipo = Math.round(horasEquipo.asMinutes());

    return NextResponse.json({
        success: true,
        users,
        totalHoras: formatTime(minutosHorasTotalesEquipo),
        minutosEquipo,
        tituloHoras: tituloHoras
    }, { status: 200 });
}
