import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";
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
    const { id, nombre, apellido, email, puesto, horasSemana, telefono, telefonoPersonal, coste, diasVacaciones, horaLunes, horaMartes, horaMiercoles, horaJueves, horaViernes } = body;

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id);

    if (errorProfile) {
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }

    console.log(id, nombre, apellido, email, puesto, horasSemana, telefono, telefonoPersonal, coste, diasVacaciones, horaLunes, horaMartes, horaMiercoles, horaJueves, horaViernes)
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

    if (dataProfile && dataProfile.length > 0) {

        const lunesUTC = horaLunes ? procesarHora(horaLunes): null;
        const martesUTC = horaMartes ? procesarHora(horaMartes): null;
        const miercolesUTC = horaMiercoles ? procesarHora(horaMiercoles): null;
        const juevesUTC = horaJueves ? procesarHora(horaJueves): null;
        const viernesUTC = horaViernes ? procesarHora(horaViernes): null;

        //console.log(lunesUTC, martesUTC, miercolesUTC, juevesUTC, viernesUTC)

         const { error: errorInsert } = await supabase
            .from('profiles')
            .update({ nombre: nombre, apellido: apellido, email: email, puesto: puesto, horas_semana: horasSemana ? parseInt(horasSemana) : null, telefono_empresa: telefono, telefono_personal: telefonoPersonal, precio_hora: coste ? parseFloat(coste).toFixed(2) : null , dias_vacaciones: diasVacaciones ? parseInt(diasVacaciones) : null , hora_fin_lunes: lunesUTC, hora_fin_martes: martesUTC, hora_fin_miercoles: miercolesUTC, hora_fin_jueves: juevesUTC, hora_fin_viernes: viernesUTC })
            .eq('id', id)

        if (errorInsert) {
            console.log('Error 1: ', errorInsert);
            return NextResponse.json({ error: errorInsert }, { status: 500 });
        } 
        
        //return NextResponse.json({ success: true }, { status: 200 });

    }

    /*if (dataProfile && dataProfile.length > 0) {

        const now = dayjs();

        const fechaOriginal = dayjs(fecha_original).tz('Europe/Madrid'); 
        console.log(fechaOriginal.format());

        const [horas, minutos] = fecha_solicitada.split(':');
        const fechaSolicitada = fechaOriginal.hour(parseInt(horas)).minute(parseInt(minutos));

        const fechaSolicitadaUTC = fechaSolicitada.utc().toISOString();

        console.log("fecha original UTC: ", dayjs(fecha_original).toISOString());
        console.log("fecha solicitada en Madrid: ", fechaSolicitada.format());
        console.log("fecha solicitada UTC: ", fechaSolicitadaUTC);

        const { error: errorInsert } = await supabase
            .from('solicitudes')
            .insert({ profile_id: dataProfile[0].id, fichaje_evento_id: fichaje_evento_id, fecha_original: fechaOriginal.toISOString(), fecha_solicitada: fechaSolicitadaUTC, evento: evento, motivo: motivo, created_at: now.toISOString(), estado: 'pendiente'});

        if (errorInsert) {
            console.log('Error inertar', errorInsert);
            return NextResponse.json({ error: errorInsert }, { status: 500 })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    }*/

    return NextResponse.json({ success: true }, { status: 200 })

}