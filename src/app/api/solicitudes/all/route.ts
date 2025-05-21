import { createClient } from "@/utils/supabase/server";
//import dayjs from "dayjs";
import { /*NextRequest,*/ NextResponse } from "next/server";

export async function GET(/*req: NextRequest*/) {
    const supabase = await createClient();

    const resultadoFinal = [];

    const { data: dataSolicitudes, error: errorSolicitudes } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('estado', 'pendiente');

    if (errorSolicitudes) {
        console.log('Error 1: ', errorSolicitudes);
        return NextResponse.json({ error: errorSolicitudes }, { status: 500 });
    }    

    if (dataSolicitudes && dataSolicitudes.length > 0) {
        for (const solicitud of dataSolicitudes) {
            const { data: dataProfile, error: errorProfile } = await supabase
                .from('profiles')
                .select('image, nombre, apellido, email')
                .eq('id', solicitud.profile_id);
              
            if (errorProfile) {
                console.log('Error 2: ', errorProfile);
                return NextResponse.json({ error: errorProfile }, { status: 500 });
            }    

            if (dataProfile && dataProfile.length > 0) { 

                resultadoFinal.push({
                    id: solicitud.id,   
                    image: dataProfile[0].image ?? '',
                    nombre: dataProfile[0].nombre ?? '',
                    apellido: dataProfile[0].apellido ?? '',
                    email: dataProfile[0].email ?? '',
                    fecha_original: solicitud.fecha_original ?? '',
                    fecha_solicitada: solicitud.fecha_solicitada,
                    created_at: solicitud.created_at,
                    motivo: solicitud.motivo,
                    evento: solicitud.evento
                })
            }
        }
    }

    console.log(resultadoFinal);

    return NextResponse.json({ success: true, data: resultadoFinal }, { status: 200 });    
}