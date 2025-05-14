import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (!user || error) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const profile_id = req.nextUrl.searchParams.get('profileId');

    const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile_id);

    if (errorProfile) {
        return NextResponse.json({ error: errorProfile }, { status: 500 })
    }

    console.log('aaaaaaa',dataProfile.length);

    if (dataProfile && dataProfile.length > 0) {
        return NextResponse.json({ success: true, profile: dataProfile[0] }, { status: 200 })
    }
}