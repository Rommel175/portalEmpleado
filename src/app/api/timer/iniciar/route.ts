import { createClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (!user || error) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { profileId, horaFinalAprox, localizacion } = body;

    const date = dayjs();
    const startDate = date.startOf('day');
    const endDate = startDate.add(1, 'day');

    const { data: dataFichaje, error: errorFichaje } = await supabase
        .from('fichaje_jornada')
        .select('id')
        .gte('date', startDate.toISOString())
        .lt('date', endDate.toISOString())
        .eq('profile_id', profileId);

    if (errorFichaje) {
        return NextResponse.json({ error: errorFichaje }, { status: 500 })
    }

    if (!dataFichaje || dataFichaje.length == 0) {
        const { error: errorInsert } = await supabase
            .from('fichaje_jornada')
            .insert({ date: date.toISOString(), profile_id: profileId, date_final_aprox: dayjs(horaFinalAprox).toISOString() })

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

            return NextResponse.json({ success: true, estado: 'Activo' }, { status: 200 });
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

        return NextResponse.json({ success: true, estado: 'Activo' }, { status: 200 });
    }
}