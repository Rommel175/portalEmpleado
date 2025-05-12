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
        return NextResponse.json({ error: errorFichaje }, { status: 500 })
    }

    if (dataFichaje && dataFichaje.length > 0) {
        const fichaje_id = dataFichaje[0].id;

        const { error: errorInsertFichajeEvent } = await supabase
            .from('fichaje_eventos')
            .insert({ fichaje_id: fichaje_id, evento: 'Inicio Pausa', date: date.toISOString(), localizacion: localizacion });

        if (errorInsertFichajeEvent) {
            return NextResponse.json({ error: errorInsertFichajeEvent }, { status: 500 })
        }

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ estado: 'Pausa' })
            .eq('id', profileId);

        if (updateError) {
            return NextResponse.json({ error: updateError }, { status: 500 })
        }

        return NextResponse.json({ success: true, estado: 'Pausa' }, { status: 200 });
    }
}