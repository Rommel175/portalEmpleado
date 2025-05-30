import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone)

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (!user || error) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { profileId, localizacion } = body;

    const date = dayjs();
    const startDate = date.startOf('day');
    const endDate = startDate.add(1, 'day');

    const { data: dataFichaje, error: errorFichaje } = await supabase
        .from('fichaje_jornada')
        .select('id')
        .gte('date', startDate.toISOString())
        .lt('date', endDate.toISOString())
        .eq('profile_id', profileId)

    if (errorFichaje) {
        return NextResponse.json({ error: errorFichaje }, { status: 500 });
    }

    if (dataFichaje && dataFichaje.length > 0) {
        const fichaje_id = dataFichaje[0].id;

        const { data: dataFichajeLastEvent, error: errorFichajeLastEvent } = await supabase
            .from('fichaje_eventos')
            .select('evento')
            .eq('fichaje_id', fichaje_id)
            .order('id', { ascending: false })
            .limit(1);

        if (errorFichajeLastEvent) {
            return NextResponse.json({ error: errorFichajeLastEvent }, { status: 500 });
        }

        if (dataFichajeLastEvent && dataFichajeLastEvent.length > 0 && dataFichajeLastEvent[0].evento == 'Inicio Pausa') {

            const { error: errorInsertFichajeEvent } = await supabase
                .from('fichaje_eventos')
                .insert({ fichaje_id: fichaje_id, evento: 'Fin Pausa', date: date.toISOString(), localizacion: localizacion });

            if (errorInsertFichajeEvent) {
                return NextResponse.json({ error: errorInsertFichajeEvent }, { status: 500 });
            }

            const { error: errorInsertFichajeEvent2 } = await supabase
                .from('fichaje_eventos')
                .insert({ fichaje_id: fichaje_id, evento: 'Jornada Finalizada', date: date.toISOString(), localizacion: localizacion });

            if (errorInsertFichajeEvent2) {
                return NextResponse.json({ error: errorInsertFichajeEvent2 }, { status: 500 });
            }

        } else {

            const { error: errorInsertFichajeEvent } = await supabase
                .from('fichaje_eventos')
                .insert({ fichaje_id: fichaje_id, evento: 'Jornada Finalizada', date: date.toISOString(), localizacion: localizacion });

            if (errorInsertFichajeEvent) {
                return NextResponse.json({ error: errorInsertFichajeEvent }, { status: 500 });
            }

        }

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ estado: 'Jornada Finalizada' })
            .eq('id', profileId);

        if (updateError) {
            return NextResponse.json({ error: updateError }, { status: 500 });
        }

        return NextResponse.json({ success: true, estado: 'Jornada Finalizada' }, { status: 200 });
    } else {

        const { data: ultimaJornada, error: errorUltimaJornada } = await supabase
            .from('fichaje_jornada')
            .select('id, date')
            .eq('profile_id', profileId)
            .order('date', { ascending: false })
            .limit(1);

        if (errorUltimaJornada) {
            console.log('Error 21: ' + errorUltimaJornada);
            return NextResponse.json({ success: false, error: 'No se encontró ninguna jornada anterior.' }, { status: 404 });
        }

        if (ultimaJornada && ultimaJornada.length > 0) {

            const { data: eventos, error: errorEventos } = await supabase
                .from('fichaje_eventos')
                .select('*')
                .eq('fichaje_id', ultimaJornada[0].id)
                .order('id', { ascending: false })
                .limit(1);

            if (errorEventos) {
                console.log('Error 22: ' + errorEventos);
                return NextResponse.json({ error: 'No se encontraron eventos en la última jornada.' }, { status: 500 });
            }

            const fecha = dayjs(eventos[0].date).tz('Europe/Madrid');
            const fechaForzada = fecha.hour(23).minute(59);
            const fechaForzadaUtc = fechaForzada.utc().toISOString();

            if (eventos[0].evento == 'Inicio Pausa') {

                const { error: errorInsertFichajeEvent } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: ultimaJornada[0].id, evento: 'Fin Pausa', date: fechaForzadaUtc, localizacion: eventos[0].localizacion });

                if (errorInsertFichajeEvent) {
                    console.log('Error 3: ', errorInsertFichajeEvent);
                    return NextResponse.json({ error: errorInsertFichajeEvent }, { status: 500 });
                }

                const { error: errorInsertFichajeEvent2 } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: ultimaJornada[0].id, evento: 'Jornada Finalizada', date: fechaForzadaUtc, localizacion: eventos[0].localizacion });

                if (errorInsertFichajeEvent2) {
                    console.log('Error 4: ', errorInsertFichajeEvent2);
                    return NextResponse.json({ error: errorInsertFichajeEvent2 }, { status: 500 });
                }

                const { error: errorUpdatingEstado } = await supabase
                    .from('profiles')
                    .update({ estado: 'Jornada Finalizada' })
                    .eq('id', profileId);

                if (errorUpdatingEstado) {
                    console.log('Error 9', errorUpdatingEstado)
                    return NextResponse.json({ error: errorUpdatingEstado }, { status: 500 })
                }

                return NextResponse.json({ success: true, acriva: true}, { status: 200 })

            } else if (eventos[0].evento == 'Inicio Jornada' || eventos[0].evento == 'Fin Pausa') {

                const { error: errorInsertFichajeEvent2 } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: ultimaJornada[0].id, evento: 'Jornada Finalizada', date: fechaForzadaUtc, localizacion: eventos[0].localizacion });

                if (errorInsertFichajeEvent2) {
                    console.log('Error 5: ', errorInsertFichajeEvent2);
                    return NextResponse.json({ error: errorInsertFichajeEvent2 }, { status: 500 });
                }

                const { error: errorUpdatingEstado } = await supabase
                    .from('profiles')
                    .update({ estado: 'Jornada Finalizada' })
                    .eq('id', profileId);

                if (errorUpdatingEstado) {
                    console.log('Error 9', errorUpdatingEstado)
                    return NextResponse.json({ error: errorUpdatingEstado }, { status: 500 })
                }

                return NextResponse.json({ success: true, acriva: true }, { status: 200 })

            }

        } else {
            const { error: errorUpdatingEstado } = await supabase
                .from('profiles')
                .update({ estado: 'Jornada Finalizada' })
                .eq('id', profileId);

            if (errorUpdatingEstado) {
                console.log('Error 9', errorUpdatingEstado)
                return NextResponse.json({ error: errorUpdatingEstado }, { status: 500 })
            }

            return NextResponse.json({ success: true }, { status: 200 })
        }

    }
}