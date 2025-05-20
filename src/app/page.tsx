import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  
  const user = data.user;

  if (!user || error) {
    redirect('/login');
  }

  const { data: dataProfile, error: errorProfile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id);

  if (errorProfile) {
    await supabase.auth.signOut();
    redirect('/login');
  }  

  if (dataProfile && dataProfile.length > 0) {
    if (dataProfile[0].is_admin) {
      redirect('/dashboard/recursos/gestion');
    } else {
      redirect('/dashboard/inicio');
    }
  }

  
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}
