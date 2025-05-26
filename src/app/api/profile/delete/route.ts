
import { createClient } from '@/utils/supabase/server';
import { createClientAdmin } from '@/utils/supabase/serverAdmin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();

    const { userId } = body;
    const supabaseAdmin = await createClientAdmin;
    const supabase = await createClient();

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('id', userId);

    if (errorProfile) {
        return NextResponse.json({ error: errorProfile }, { status: 500 });
    }

    if (dataProfile) {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(dataProfile[0].user_id);

        if (error) {
            console.log('Error al eliminar el usuario: ', error)
            return NextResponse.json({ error: error }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    }
}
