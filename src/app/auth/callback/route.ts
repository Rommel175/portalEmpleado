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
  const supabaseAdmin = await createClientAdmin;

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

  if (email == 'rommel.xana@gmail.com' || email == 'example.xana@gmail.com' || email.endsWith('@xanasystem.com') || email.endsWith('@xanatechnolgies.com') || email == 'rrhh.portalxana@gmail.com') {

    const { data: dataProfile, error: errorProfle } = await supabase
      .from('profiles')
      .select('id, image, estado')
      .eq('user_id', user.id)

    if (errorProfle) {
      console.log('Error fetching Profile ID: ', errorProfle);
      return NextResponse.json({ error: errorProfle }, { status: 500})
    }

    if (!dataProfile || dataProfile.length === 0) {
      
      try {
        const id = user?.id;

        if (id) {
          await supabaseAdmin.auth.admin.deleteUser(id)
        }
      } catch (e) {
        console.log('Error eliminando usuario no autorizado ' + e);
        return NextResponse.json({ error: `Error eliminando usuario no autorizado ${e}` }, { status: 500 });
      }

      return NextResponse.redirect(`${origin}/login`);

    } else {
      const currentImage = dataProfile[0].image;

      if (currentImage !== user.user_metadata.avatar_url) {
        const { error: errorUpdateImage } = await supabase
          .from('profiles')
          .update({ image: user.user_metadata.avatar_url })
          .eq('user_id', user.id);

        if (errorUpdateImage) {
          console.log('Error actualizando imagen de perfil: ', errorUpdateImage);
          return NextResponse.json({ error: errorUpdateImage }, { status: 500 });
        }
      }

      if (dataProfile[0].estado == 'Activo' || dataProfile[0].estado == 'Pausa') {
        const { error: errorUpdateImage } = await supabase
          .from('profiles')
          .update({ estado: 'Inactivo' })
          .eq('user_id', user.id);

        if (errorUpdateImage) {
          console.log('Error actualizando estado del perfil: ', errorUpdateImage);
          return NextResponse.json({ error: errorUpdateImage }, { status: 500 });
        }
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

    try {
      const id = user?.id;

      if (id) {
        await supabaseAdmin.auth.admin.deleteUser(id)
      }
    } catch (e) {
      console.log('Error eliminando usuario no autorizado ' + e);
      return NextResponse.json({ error: `Error eliminando usuario no autorizado ${e}` }, { status: 500 });
    }

    return NextResponse.redirect(`${origin}/login`);

  }
}