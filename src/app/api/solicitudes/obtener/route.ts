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
    const checkedStateRegistro = JSON.parse(req.nextUrl.searchParams.get('checkedStateRegistro') || '{}');

    const EVENT_TYPES = ['Inicio Jornada', 'Inicio Pausa', 'Fin Pausa', 'Jornada Finalizada'];

    let selectedTipos = Object.entries(checkedStateRegistro)
        .filter(([, isChecked]) => isChecked)
        .map(([index]) => EVENT_TYPES[parseInt(index)]);

    if (selectedTipos.length === 0) {
        selectedTipos = [...EVENT_TYPES];
    }

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

        const [start, end] = rangosPresets();

        const { data: dataSolicitudes, error: errorSolicitudes } = await supabase
            .from('solicitudes')
            .select('*')
            .eq('profile_id', dataProfile[0].id)
            .gte('created_at', start.toISOString())
            .lt('created_at', end.toISOString())
            .in('evento', selectedTipos)
            .order('created_at', { ascending: !reciente });
        
        if (errorSolicitudes) {
            console.log('Error solicitudes1: ', errorSolicitudes);
            return NextResponse.json({error: errorProfile}, {status: 500});
        }    

        //console.log(dataSolicitudes);

        return NextResponse.json({ success: true, data: dataSolicitudes }, { status: 200 });
    }
}