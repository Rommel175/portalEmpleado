import { createClient } from "@/utils/supabase/server";
import { createClientAdmin } from "@/utils/supabase/serverAdmin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;
  const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();
  const next = requestUrl.searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = await createClient();
  await supabase.auth.exchangeCodeForSession(code);

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const user = data.user
  const email = user?.user_metadata.email;

  if (email == 'rommel.xana@gmail.com' || email == 'example.xana@gmail.com' || email.endsWith('@xanasystem.com') || email.endsWith('@xanatechnolgies.com')) {

    const { data: dataProfile, error: errorProfle } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)

    if (errorProfle) {
      console.log('Error fetching Profile ID: ', errorProfle)
    }

    if (!dataProfile || dataProfile.length === 0) {
      const { data: dataInsertProfile, error: errorInsertProfile } = await supabase
        .from('profiles')
        .insert({ user_id: user.id, full_name: user.user_metadata.full_name, email: user.email, image: user.user_metadata.avatar_url, estado: 'Inactivo', alta: false })

      if (errorInsertProfile) {
        console.log('Error insert Profile: ', errorInsertProfile);
        return;
      }

      if (dataInsertProfile) {
        console.log(dataInsertProfile);
      }
    }

    if (next) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    if (redirectTo) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    return NextResponse.redirect(`${origin}/`);

  } else {

    const supabaseAdmin = await createClientAdmin;

    try {
      const id = user?.id;

      if (id) {
        await supabaseAdmin.auth.admin.deleteUser(id)
      }
    } catch (e) {
      console.log('Error eliminando usuario no autorizado ' + e)
    }

    return NextResponse.redirect(`${origin}/login`);

  }
}