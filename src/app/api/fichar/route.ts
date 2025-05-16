import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (!user || error) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { profileId, comentario, horaFinalAprox, localizacion } = body;

    const date = dayjs();
    const startDate = date.startOf('day');
    const endDate = startDate.add(1, 'day');


    const { data: dataFichaje, error: errorFichaje } = await supabase
        .from('fichaje_jornada')
        .select('id')
        .gte('date', startDate.toISOString())
        .lt('date', endDate.toISOString())
        .eq('profile_id', profileId);

    /*const { data: dataFichaje, error: errorFichaje } = await supabase
        .from('fichaje_jornada')
        .select('id, date')
        .eq('profile_id', profileId)
        .order('date', { ascending: false })
        .limit(1);*/


    if (errorFichaje) {
        return NextResponse.json({ error: errorFichaje }, { status: 500 })
    }

    if (!dataFichaje || dataFichaje.length == 0) {

        //Cojemos último fichaje

        const { data: ultimoFichaje, error: errorUltimoFichaje } = await supabase
            .from('fichaje_jornada')
            .select('id, date')
            .eq('profile_id', profileId)
            .order('date', { ascending: false })
            .limit(1);

        if (errorUltimoFichaje) {
            return NextResponse.json({ error: errorUltimoFichaje }, { status: 500 });
        }

        if (ultimoFichaje && ultimoFichaje.length > 0) {
            //Cojemos el último evento del último fixhaje
            const { data: dataFichajeEvento, error: errorFichajeEvento } = await supabase
                .from('fichaje_eventos')
                .select('*')
                .eq('fichaje_id', ultimoFichaje[0].id)
                .order('date', { ascending: false })
                .limit(1);

            if (errorFichajeEvento) {
                return NextResponse.json({ error: errorFichajeEvento }, { status: 500 });
            }

            if (dataFichajeEvento && dataFichajeEvento.length > 0) {
                //comprobamos que evento es
                if (dataFichajeEvento[0].evento == 'Inicio Pausa') {

                    const { error: errorInsertFichajeEvent } = await supabase
                        .from('fichaje_eventos')
                        .insert({ fichaje_id: ultimoFichaje[0].id, evento: 'Fin Pausa', date: date.toISOString(), localizacion: localizacion });

                    if (errorInsertFichajeEvent) {
                        return NextResponse.json({ error: errorInsertFichajeEvent }, { status: 500 });
                    }

                    const { error: errorInsertFichajeEvent2 } = await supabase
                        .from('fichaje_eventos')
                        .insert({ fichaje_id: ultimoFichaje[0].id, evento: 'Jornada Finalizada', date: date.toISOString(), localizacion: localizacion });

                    if (errorInsertFichajeEvent2) {
                        return NextResponse.json({ error: errorInsertFichajeEvent2 }, { status: 500 });
                    }

                } else if (dataFichajeEvento[0].evento == 'Inicio Jornada' || dataFichajeEvento[0].evento == 'Fin Pausa') {

                    const { error: errorInsertFichajeEvent2 } = await supabase
                        .from('fichaje_eventos')
                        .insert({ fichaje_id: ultimoFichaje[0].id, evento: 'Jornada Finalizada', date: date.toISOString(), localizacion: localizacion });

                    if (errorInsertFichajeEvent2) {
                        return NextResponse.json({ error: errorInsertFichajeEvent2 }, { status: 500 });
                    }

                }


                const { error: errorInsert } = await supabase
                    .from('fichaje_jornada')
                    .insert({ date: date.toISOString(), profile_id: profileId, comentario: comentario, date_final_aprox: dayjs(horaFinalAprox).toISOString() })

                if (errorInsert) {
                    return NextResponse.json({ error: errorInsert }, { status: 500 });
                }

                const { data: dataNewFichaje, error: errorNewFichaje } = await supabase
                    .from('fichaje_jornada')
                    .select('id')
                    .gte('date', startDate.toISOString())
                    .lt('date', endDate.toISOString())
                    .eq('profile_id', profileId);

                if (errorNewFichaje || !dataNewFichaje || dataNewFichaje.length == 0) {
                    return NextResponse.json({ error: errorNewFichaje }, { status: 500 })
                }

                if (dataNewFichaje && dataNewFichaje.length > 0) {

                    
                    const fichaje_id = dataNewFichaje[0].id;

                    const { error: errorInsertEvento } = await supabase
                        .from('fichaje_eventos')
                        .insert({ fichaje_id: fichaje_id, evento: 'Inicio Jornada', date: date.toISOString(), localizacion: localizacion });

                    if (errorInsertEvento) {
                        return NextResponse.json({ error: errorInsertEvento }, { status: 500 });
                    }

                    const { error: errorUpdatingEstado } = await supabase
                        .from('profiles')
                        .update({ estado: 'Activo' })
                        .eq('id', profileId)

                    if (errorUpdatingEstado) {
                        return NextResponse.json({ error: errorUpdatingEstado }, { status: 500 })
                    }

                    return NextResponse.json({ success: true }, { status: 200 })







                }
            }

        } else {
            const fichaje_id = dataFichaje[0].id;

            const { error: errorInsertFichajeEvent } = await supabase
                .from('fichaje_eventos')
                .insert({ fichaje_id: fichaje_id, evento: 'Inicio Jornada', date: date.toISOString(), localizacion: localizacion });

            if (errorInsertFichajeEvent) {
                return NextResponse.json({ error: errorInsertFichajeEvent }, { status: 500 })
            }

            const { error: errorUpdatingEstado } = await supabase
                .from('profiles')
                .update({ estado: 'Activo' })
                .eq('id', profileId)

            if (errorUpdatingEstado) {
                return NextResponse.json({ error: errorUpdatingEstado }, { status: 500 })
            }

            return NextResponse.json({ success: true }, { status: 200 })
        }
    }
}    