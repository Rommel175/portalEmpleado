import { createClient } from "@/utils/supabase/server";
import { /*NextRequest,*/ NextResponse } from "next/server";

export async function GET(/*req: NextRequest*/) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (!user || error) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    /*const option = req.nextUrl.searchParams.get('option');
    const startDate = req.nextUrl.searchParams.get('startDate');
    const endDate = req.nextUrl.searchParams.get('endDate');
    const reciente = req.nextUrl.searchParams.get('reciente');
    const checkedState = JSON.parse(req.nextUrl.searchParams.get('checkedState') || '{}');*/


    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        //.neq('user_id', user.id);

    if (errorProfile || !dataProfile.length) {
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }

    /*function rangosPresets() {
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
    }*/

    //const [start, end] = rangosPresets();

    if (dataProfile && dataProfile.length) {
        const usersData = [];
        /*const selectedProfiles = Object.keys(checkedState)
            .filter((key) => checkedState[parseInt(key)])
            .map((key) => parseInt(key));

        const showProfiles = selectedProfiles.length === 0 ? dataProfile : dataProfile.filter((profile) =>
            selectedProfiles.includes(profile.id)
        );*/

        for (const profile of dataProfile) {
            const { data: fichajeJornada, error: errorFichajeJornada } = await supabase
                .from('fichaje_jornada')
                .select('*')
                .eq('profile_id', profile.id)
                .not('comentario', 'is', null)
                .neq('comentario', '')
                /*.gte('date', start.toISOString())
                .lt('date', end.toISOString())
                .order('date', { ascending: !reciente });*/


            if (errorFichajeJornada) {
                return NextResponse.json({ error: errorFichajeJornada }, { status: 500 });
            }

            if (fichajeJornada && fichajeJornada.length > 0) {
                usersData.push({
                    id: profile.id,
                    nombre: profile.nombre,
                    apellido: profile.apellido,
                    email: profile.email,
                    image: profile.image,
                    fichajes: fichajeJornada.map(item => ({
                        fecha: item.date,
                        comentario: item.comentario,
                    })),
                });
            }
        }

        console.log(usersData)

        return NextResponse.json({ success: true, usersData: usersData }, { status: 200 })
    }

}