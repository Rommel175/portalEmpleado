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
    const { fichaje_evento_id, fecha_original, fecha_solicitada, evento, motivo } = body;

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id);

    if (errorProfile) {
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }

    if (dataProfile && dataProfile.length > 0) {

        const now = dayjs();
        //console.log(now.toISOString());

        const fechaOriginal = dayjs(fecha_original);
        //console.log(fechaOriginal.toISOString());

        const [horas, minutos] = fecha_solicitada.split(':');
        const fechaSolicitada = fechaOriginal.hour(horas).minute(minutos);
        //console.log(fechaSolicitada.toISOString());

        const { error: errorInsert } = await supabase
            .from('solicitudes')
            .insert({ profile_id: dataProfile[0].id, fichaje_evento_id: fichaje_evento_id, fecha_original: fechaOriginal.toISOString(), fecha_solicitada: fechaSolicitada.toISOString(), evento: evento, motivo: motivo, created_at: now.toISOString(), estado: 'pendiente'});

        if (errorInsert) {
            //console.log('Error inertar', errorInsert);
            return NextResponse.json({ error: errorInsert }, { status: 500 })
        }
        
        return NextResponse.json({ success: true }, { status: 200 })
    }



}