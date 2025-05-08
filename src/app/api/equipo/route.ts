import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (!user || error) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: dataEquipo, error: errorEquipo } = await supabase
        .from('profiles')
        .select('id, nombre, apellido, email, image, estado, horas_semana, fichaje_jornada(id, date, date_final_aprox,total_trabajado, comentario, profile_id, fichaje_eventos(*))')
        .neq('user_id', user.id);

    if (errorEquipo) {
        return NextResponse.json({ error: errorEquipo }, { status: 500 })
    }

    if (dataEquipo && dataEquipo.length > 0) {
        return NextResponse.json({ success: true, dataEquipo: dataEquipo })
    }
}