import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { createClientAdmin } from "@/utils/supabase/serverAdmin";

dayjs.extend(utc);
dayjs.extend(timezone)

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const supabaseAdmin = await createClientAdmin;

    const { data, error } = await supabase.auth.getUser();

    const user = data.user;

    if (!user || error) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { nombre, apellido, email, puesto, horasSemana, telefono, telefonoPersonal, coste, diasVacaciones, horaLunes, horaMartes, horaMiercoles, horaJueves, horaViernes } = body;

    /*const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id);

    if (errorProfile) {
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }*/

    console.log(nombre, apellido, email, puesto, horasSemana, telefono, telefonoPersonal, coste, diasVacaciones, horaLunes, horaMartes, horaMiercoles, horaJueves, horaViernes);
    console.log('FLOAT: ', parseFloat(coste).toFixed(2));

    const now = dayjs().tz('Europe/Madrid');

    function procesarHora(hora: string) {
        if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(hora)) {
            const [horas, minutos] = hora.split(':');
            const result = now.hour(parseInt(horas)).minute(parseInt(minutos));
            const utc = result.utc().toISOString();
            //console.log(utc);
            return utc;
        } else {
            console.error(`Formato de hora inválido`);
            return null;
        }
    }



    const lunesUTC = horaLunes ? procesarHora(horaLunes) : null;
    const martesUTC = horaMartes ? procesarHora(horaMartes) : null;
    const miercolesUTC = horaMiercoles ? procesarHora(horaMiercoles) : null;
    const juevesUTC = horaJueves ? procesarHora(horaJueves) : null;
    const viernesUTC = horaViernes ? procesarHora(horaViernes) : null;

    console.log('Lunes:', lunesUTC);
    console.log('Martes:', martesUTC);
    console.log('Miercoles:', miercolesUTC);
    console.log('Jueves:', juevesUTC);
    console.log('Viernes:', viernesUTC);

    //console.log(lunesUTC, martesUTC, miercolesUTC, juevesUTC, viernesUTC)

    /*const { error: errorInsert } = await supabase
        .from('profiles')
        .update({ nombre: nombre, apellido: apellido, email: email, puesto: puesto, horas_semana: horasSemana ? parseInt(horasSemana) : null, telefono_empresa: telefono, telefono_personal: telefonoPersonal, precio_hora: coste ? parseFloat(coste).toFixed(2) : null, dias_vacaciones: diasVacaciones ? parseInt(diasVacaciones) : null, hora_fin_lunes: lunesUTC, hora_fin_martes: martesUTC, hora_fin_miercoles: miercolesUTC, hora_fin_jueves: juevesUTC, hora_fin_viernes: viernesUTC })
        .eq('id', id)

    if (errorInsert) {
        console.log('Error 1: ', errorInsert);
        return NextResponse.json({ error: errorInsert }, { status: 500 });
    }*/

    const { data: createUser, error: errorCreateUser } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: false,
        user_metadata: { full_name: `${nombre} ${apellido}` },
    });

    if (errorCreateUser) {
        console.error('Error creando usuario:', errorCreateUser);
        return NextResponse.json({ error: errorCreateUser }, { status: 500 });
    }

    if (!createUser || !createUser.user) {
        console.error('No se recibió usuario al crear:', createUser);
        return NextResponse.json({ error: 'No se pudo crear el usuario correctamente' }, { status: 500 });
    }


    const { error: errorInsertProfile } = await supabase
        .from('profiles')
        .insert({
            user_id: createUser.user.id,
            nombre: nombre,
            apellido: apellido,
            puesto: puesto,
            telefono_empresa: telefono,
            telefono_personal: telefonoPersonal,
            email: email,
            horas_semana: horasSemana ? parseInt(horasSemana) : null,
            image: createUser.user.user_metadata.avatar_url,
            estado: 'Inactivo',
            alta: true,
            is_admin: false,
            hora_fin_lunes: lunesUTC,
            hora_fin_martes: martesUTC,
            hora_fin_miercoles: miercolesUTC,
            hora_fin_jueves: juevesUTC,
            hora_fin_viernes: viernesUTC,
            dias_vacaciones: diasVacaciones ? parseInt(diasVacaciones) : null,
            precio_hora: coste ? parseFloat(coste).toFixed(2) : null
        });

    if (errorInsertProfile) {
        console.log(errorInsertProfile)
        return NextResponse.json({ error: errorInsertProfile }, { status: 500 });
    }



    return NextResponse.json({ success: true }, { status: 200 })

}