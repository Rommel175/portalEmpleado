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

  if (email.endsWith("xana@gmail.com")) {

    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      if (next) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_VERCEL_URL}${next}`);
      }
  
      if (redirectTo) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_VERCEL_URL}${origin}${redirectTo}`);
      }
  
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_VERCEL_URL}/`);  
    } else {
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }
  
      if (redirectTo) {
        return NextResponse.redirect(`${origin}${redirectTo}`);
      }
  
      return NextResponse.redirect(`${origin}/`);
    }

  } else {

    const supabaseAdmin = await createClientAdmin;


    const id = user?.id;

    if (id) {
      await supabaseAdmin.auth.admin.deleteUser(id)
    }

    return NextResponse.redirect(`${origin}/login`);

  }
}