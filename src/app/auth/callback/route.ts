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

  if (email == 'rommel.xana@gmail.com' || email.endsWith('@xanasystem.com') || email.endsWith('@xanatechnolgies.com')) {

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const mounth = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const { data, error } = await supabase
      .from('historialFichajes')
      .select('estado')
      .eq('created_at', `${year}-${mounth}-${day}`)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching fichaje state:', error);
    }

    if (!data || data.length === 0) {
      const { data: dataInsert, error: errorInsert } = await supabase
        .from('historialFichajes')
        .insert({ estado: 'Inactivo', created_at: `${year}-${mounth}-${day}`, user_id: user.id });

      if (errorInsert) {
        console.error('Error insert fichaje:', errorInsert);
        return;
      }

      if (dataInsert) {
        console.log(dataInsert)
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