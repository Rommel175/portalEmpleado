import { createClient } from "@/utils/supabase/server";
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
    const reciente = req.nextUrl.searchParams.get('reciente');
    const localizacion = req.nextUrl.searchParams.get('localizacion');
    const profileId = req.nextUrl.searchParams.get('profileId');


    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId);

    if (errorProfile || !dataProfile.length) {
        console.log('Error 1')
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }

    if (dataProfile && dataProfile.length > 0) {
        function rangosPresets() {
            const now = new Date();
            let start = new Date(now);
            let end = new Date(now);

            switch (option) {
                case 'Esta semana':
                    const day = start.getDay();
                    const diffToMonday = day === 0 ? -6 : 1 - day;
                    start.setDate(start.getDate() + diffToMonday);
                    end = new Date(start);
                    end.setDate(start.getDate() + 5);
                    break;
                case 'Hoy':
                case 'Ayer':
                    if (!startDate) return [start, end];
                    start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    end = new Date(start);
                    end.setDate(end.getDate() + 1);
                    break;
                case 'Semana pasada':
                case 'Este mes':
                case 'Mes pasado':
                case 'Este año':
                case 'Año pasado':
                    if (!startDate || !endDate) return [start, end];
                    start = new Date(startDate);
                    end = new Date(endDate);
                    end.setDate(end.getDate() + 1);
                    break;
            }

            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return [start, end];
        }

        const [start, end] = rangosPresets();

        const { data: jornadaData, error: jornadaError } = await supabase
            .from('fichaje_jornada')
            .select('*')
            .eq('profile_id', profileId)
            .gte('date', start.toISOString())
            .lt('date', end.toISOString())
            .order('date', { ascending: !reciente });

        if (jornadaError) {
            console.log('Error 2')
            return NextResponse.json({ error: jornadaError }, { status: 500 });
        }

        const fechas = jornadaData.map(item => item.date) ?? [];

        const resultadoFinal = [];

        for (const fecha of fechas) {
            const { data: dataFichajes, error: errorFichajes } = await supabase
                .from('fichaje_jornada')
                .select('*')
                .eq('profile_id', profileId)
                .eq('date::date', fecha);

            if (errorFichajes) {
                console.log('Error 3')
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
                            .order('id', {ascending: true})

                        if (errorEvento) {
                            console.log('Error 4')
                        }

                        if (dataEvento && dataEvento.length > 0) {
                            const eventosData = dataEvento.map(item => ({
                                id: item.id,
                                fichaje_id: item.fichaje_id,
                                evento: item.evento,
                                date: new Date(item.date),
                                localizacion: item.localizacion,
                            }));

                            eventos.push(...eventosData)

                        }
                    } else {
                        const { data: dataEvento, error: errorEvento } = await supabase
                            .from('fichaje_eventos')
                            .select('*')
                            .eq('fichaje_id', fichaje.id)
                            .eq('localizacion', localizacion);

                        if (errorEvento) {
                            console.log('Error 5')
                        }

                        if (dataEvento && dataEvento.length > 0) {
                            const eventosData = dataEvento.map(item => ({
                                id: item.id,
                                fichaje_id: item.fichaje_id,
                                evento: item.evento,
                                date: item.date,
                                localizacion: item.localizacion,
                            }));

                            eventos.push(...eventosData)
                        }
                    }
                }

                resultadoFinal.push({
                    fecha,
                    eventos
                })
            }
        }



        return NextResponse.json({ success: true, data: resultadoFinal, profile: dataProfile[0] });
    }
}