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

    //Comprobamos si esta completa la jornada anterior
    const { data: dataUltimoFichaje, error: errorUltimoFichaje } = await supabase
        .from('fichaje_jornada')
        .select('id, date')
        .eq('profile_id', profileId)
        .order('date', { ascending: false })
        .limit(1);

    if (errorUltimoFichaje) {
        console.log('Error 1: ', errorUltimoFichaje)
        return NextResponse.json({ error: errorUltimoFichaje }, { status: 500 });
    }

    if (dataUltimoFichaje && dataUltimoFichaje.length > 0) {
        const { data: dataEventos, error: errorEventos } = await supabase
            .from('fichaje_eventos')
            .select('*')
            .eq('fichaje_id', dataUltimoFichaje[0].id)
            .order('date', { ascending: false })
            .limit(1);
        ;

        if (errorEventos) {
            console.log('Error 2: ', errorEventos);
            return NextResponse.json({ error: errorEventos }, { status: 500 });
        }

        if (dataEventos && dataEventos.length > 0) {
            //Si el último evento es "Inicio Pausa"
            if (dataEventos[0].evento == 'Inicio Pausa') {

                const { error: errorInsertFichajeEvent } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: dataUltimoFichaje[0].id, evento: 'Fin Pausa', date: date.toISOString(), localizacion: dataEventos[0].localizacion });

                if (errorInsertFichajeEvent) {
                    console.log('Error 3: ', errorInsertFichajeEvent);
                    return NextResponse.json({ error: errorInsertFichajeEvent }, { status: 500 });
                }

                const { error: errorInsertFichajeEvent2 } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: dataUltimoFichaje[0].id, evento: 'Jornada Finalizada', date: date.toISOString(), localizacion: dataEventos[0].localizacion });

                if (errorInsertFichajeEvent2) {
                    console.log('Error 4: ', errorInsertFichajeEvent2);
                    return NextResponse.json({ error: errorInsertFichajeEvent2 }, { status: 500 });
                }

            } else if (dataEventos[0].evento == 'Inicio Jornada' || dataEventos[0].evento == 'Fin Pausa') {

                const { error: errorInsertFichajeEvent2 } = await supabase
                    .from('fichaje_eventos')
                    .insert({ fichaje_id: dataUltimoFichaje[0].id, evento: 'Jornada Finalizada', date: date.toISOString(), localizacion: dataEventos[0].localizacion });

                if (errorInsertFichajeEvent2) {
                    console.log('Error 5: ', errorInsertFichajeEvent2);
                    return NextResponse.json({ error: errorInsertFichajeEvent2 }, { status: 500 });
                }

            }
        }

    }


    //Comprobamos si hay un fichaje hoy
    const { data: dataFichaje, error: errorFichaje } = await supabase
        .from('fichaje_jornada')
        .select('id')
        .gte('date', startDate.toISOString())
        .lt('date', endDate.toISOString())
        .eq('profile_id', profileId);

    if (errorFichaje) {
        console.log('Error 6: ', errorFichaje);
        return NextResponse.json({ error: errorFichaje }, { status: 500 })
    }

    //Si no hay fichaje
    if (!dataFichaje || dataFichaje.length == 0) {
        const { data: dataInsert, error: errorInsert } = await supabase
            .from('fichaje_jornada')
            .insert({
                profile_id: profileId,
                date: date.toISOString(),
                date_final_aprox: horaFinalAprox ? dayjs(horaFinalAprox).toISOString() : null,
                comentario: comentario
            })
            .select();

        if (errorInsert) {
            console.log('Error 7', errorInsert)
            return NextResponse.json({ error: errorInsert }, { status: 500 })
        }

        if (dataInsert) {
            //console.log('Fichaje insertado', dataInsert[0].id)

            const { error: errorInsert2 } = await supabase
                .from('fichaje_eventos')
                .insert({
                    fichaje_id: dataInsert[0].id,
                    evento: 'Inicio Jornada',
                    localizacion: localizacion,
                    date: date.toISOString()
                })

            if (errorInsert2) {
                console.log('Error 8', errorInsert2)
                return NextResponse.json({ error: errorInsert2 }, { status: 500 })
            }

            const { error: errorUpdatingEstado } = await supabase
                .from('profiles')
                .update({ estado: 'Activo' })
                .eq('id', profileId);

            if (errorUpdatingEstado) {
                console.log('Error 9', errorUpdatingEstado)
                return NextResponse.json({ error: errorUpdatingEstado }, { status: 500 })
            }

            return NextResponse.json({ success: true }, { status: 200 });
        }

    } else {
        //Si hay fichaje

        const { data: dataFichajeActual, error: errorFichajeActual } = await supabase
            .from('fichaje_jornada')
            .select('id')
            .eq('profile_id', profileId)
            .order('date', { ascending: false })
            .limit(1);
        
        //console.log('dddd',dataFichajeActual);

        if (errorFichajeActual) {
            console.log('Error 10: ', errorFichajeActual);
            return NextResponse.json({ error: errorFichajeActual }, { status: 500 });
        }

        if (dataFichajeActual && dataFichajeActual.length > 0) {

            if (!comentario || comentario.trim() === '') {
                const { error: errorUpdatingComentario } = await supabase
                    .from('fichaje_jornada')
                    .update({ comentario: comentario })
                    .eq('id', dataFichajeActual[0].id);

                if (errorUpdatingComentario) {
                    console.log('Error 11: ', errorUpdatingComentario);
                    return NextResponse.json({ error: errorUltimoFichaje }, { status: 500 });
                } 
            }

            const { error: errorInsert2 } = await supabase
                .from('fichaje_eventos')
                .insert({
                    fichaje_id: dataFichajeActual[0].id,
                    evento: 'Inicio Jornada',
                    localizacion: localizacion,
                    date: date.toISOString()
                })

            if (errorInsert2) {
                console.log('Error 12', errorInsert2)
                return NextResponse.json({ error: errorInsert2 }, { status: 500 })
            }

            const { error: errorUpdatingEstado } = await supabase
                .from('profiles')
                .update({ estado: 'Activo' })
                .eq('id', profileId);

            if (errorUpdatingEstado) {
                console.log('Error 13', errorUpdatingEstado)
                return NextResponse.json({ error: errorUpdatingEstado }, { status: 500 })
            }

            return NextResponse.json({ success: true }, { status: 200 });
        }

    }

}    