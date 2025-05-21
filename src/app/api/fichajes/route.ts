import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

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
    const reciente = req.nextUrl.searchParams.get('reciente') === 'true';
    const localizacion = req.nextUrl.searchParams.get('localizacion');
    const checkedStateRegistro = JSON.parse(req.nextUrl.searchParams.get('checkedStateRegistro') || '{}');

    const EVENT_TYPES = ['Inicio Jornada', 'Inicio Pausa', 'Fin Pausa', 'Jornada Finalizada'];

    let selectedTipos = Object.entries(checkedStateRegistro)
        .filter(([, isChecked]) => isChecked)
        .map(([index]) => EVENT_TYPES[parseInt(index)]);

    if (selectedTipos.length === 0) {
        selectedTipos = [...EVENT_TYPES];
    }


    let horas;

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

    if (errorProfile || !dataProfile.length) {
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }

    if (dataProfile && dataProfile.length > 0) {
        function rangosPresets() {
            let start = dayjs();
            let end = dayjs();

            switch (option) {
                case 'Esta semana':
                    const now = dayjs();
                    start = now.day(1).startOf('day');
                    end = now.day(1).add(5, 'day').endOf('day');
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

        switch (option) {
            case 'Hoy':
            case 'Ayer':
                horas = dataProfile[0].horas_semana / 5;
                //console.log('horas', horas);
                break;
            case 'Esta semana':
            case 'Semana pasada':
                horas = dataProfile[0].horas_semana;
                //console.log('horas', horas);
                break;
            case 'Este mes':
            case 'Mes pasado':
                horas = dataProfile[0].horas_semana * 4;
                //console.log('horas', horas);
                break;
            case 'Este año':
            case 'Año pasado':
                horas = (dataProfile[0].horas_semana / 5) * 365;
                //console.log('horas', horas);
                break;
            default:
                horas = dataProfile[0].horas_semana
                //console.log('horas', horas);
                break;
        }

        const [start, end] = rangosPresets();

        const { data: jornadaData, error: jornadaError } = await supabase
            .from('fichaje_jornada')
            .select('*')
            .eq('profile_id', dataProfile[0].id)
            .gte('date', start.toISOString())
            .lt('date', end.toISOString())
            .order('date', { ascending: !reciente });

        if (jornadaError) {
            return NextResponse.json({ error: jornadaError }, { status: 500 });
        }

        const fechas = jornadaData.map(item => item.date) ?? [];

        const resultadoFinal = [];

        for (const fecha of fechas) {
            const { data: dataFichajes, error: errorFichajes } = await supabase
                .from('fichaje_jornada')
                .select('*')
                .eq('profile_id', dataProfile[0].id)
                .eq('date::date', fecha);

            if (errorFichajes) {
                return NextResponse.json({ error: errorFichajes }, { status: 500 });
            }

            if (dataFichajes && dataFichajes.length > 0) {
                const eventos = [];

                for (const fichaje of dataFichajes) {

                    if (localizacion == 'all') {

                        const { data: dataEvento, error: errorEvento } = await supabase
                            .from('fichaje_eventos')
                            .select('*')
                            .eq('fichaje_id', fichaje.id)
                            .in('evento', selectedTipos)
                            .order('id', { ascending: true });

                        if (errorEvento) {
                            console.log('Error 4')
                        }

                        if (dataEvento && dataEvento.length > 0) {
                            //console.log(dataEvento)

                            /*const eventosData = dataEvento.map(item => ({
                                id: item.id,
                                fichaje_id: item.fichaje_id,
                                evento: item.evento,
                                date: new Date(item.date),
                                localizacion: item.localizacion,
                            }));

                            eventos.push(...eventosData)*/

                            const eventosData = [];

                            for (const item of dataEvento) {
                                let date;

                                if (item.modificado) {
                                    const { data: modificacionesData, error: errorModificacionesData } = await supabase
                                        .from('modificaciones_eventos')
                                        .select('fecha_modificada')
                                        .eq('fichaje_evento_id', item.id)
                                        .order('created_at', {ascending: false})

                                    if (errorModificacionesData) {
                                        console.log('Error modificaciones data: ', errorModificacionesData);
                                        return NextResponse.json({ error: errorModificacionesData }, { status: 500 })
                                    }

                                    date = new Date(modificacionesData[0].fecha_modificada)
                                } else {
                                    date = new Date(item.date);
                                }

                                eventosData.push({
                                    id: item.id,
                                    fichaje_id: item.fichaje_id,
                                    evento: item.evento,
                                    date: date,
                                    localizacion: item.localizacion,
                                })
                            }

                            eventos.push(...eventosData);
                        }

                    } else {

                        const { data: dataEvento, error: errorEvento } = await supabase
                            .from('fichaje_eventos')
                            .select('*')
                            .eq('fichaje_id', fichaje.id)
                            .in('evento', selectedTipos)
                            .eq('localizacion', localizacion);

                        if (errorEvento) {
                            return NextResponse.json({ error: errorEvento }, { status: 500 })
                        }

                        if (dataEvento && dataEvento.length > 0) {
                            /*const eventosData = dataEvento.map(item => ({
                                id: item.id,
                                fichaje_id: item.fichaje_id,
                                evento: item.evento,
                                date: item.date,
                                localizacion: item.localizacion,
                            }));*/

                            const eventosData = [];

                            for (const item of dataEvento) {
                                let date;

                                if (item.modificado) {
                                    const { data: modificacionesData, error: errorModificacionesData } = await supabase
                                        .from('modificaciones_eventos')
                                        .select('fecha_modificada')
                                        .eq('fichaje_evento_id', item.id)
                                        .order('created_at', {ascending: false})

                                    if (errorModificacionesData) {
                                        console.log('Error modificaciones data: ', errorModificacionesData);
                                        return NextResponse.json({ error: errorModificacionesData }, { status: 500 })
                                    }

                                    date = new Date(modificacionesData[0].fecha_modificada)
                                } else {
                                    date = new Date(item.date);
                                }

                                eventosData.push({
                                    id: item.id,
                                    fichaje_id: item.fichaje_id,
                                    evento: item.evento,
                                    date: date,
                                    localizacion: item.localizacion,
                                })
                            }

                            eventos.push(...eventosData);
                        }

                    }
                }

                resultadoFinal.push({
                    fecha,
                    eventos
                })
            }
        }

        //console.log('AAAAAAAAAAAAAA',resultadoFinal)

        return NextResponse.json({ success: true, data: resultadoFinal, profile: dataProfile[0], horas_semana: horas }, { status: 200 });
    }
}