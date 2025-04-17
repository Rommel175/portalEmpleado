import EntradasFichajes from '@/components/containers/historialFichajes/EntradasFichajes';
import ContainerOptions from '@/components/containers/ContainerOptions';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Fichajes() {


  const supabase = await createClient();

  const fechas: string[] = [];

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log('Error fetching User:', error);
  }

  const user = data.user;

  if (!user) {
    await supabase.auth.signOut();
    redirect('/login');
  }

  let profile = [];

  const { data: dataProfile, error: errorProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', data.user?.id)

  if (errorProfile) {
    console.log('Error fetching Profile: ', errorProfile)
  }

  if (dataProfile && dataProfile.length > 0) {
    profile = dataProfile
  } else {
    await supabase.auth.signOut();
    redirect('/login');
  }

  const { data: dataJornada, error: errorJornada } = await supabase
    .from('fichaje_jornada')
    .select('*')
    .eq('profile_id', profile[0].id)
    .order('date', { ascending: false });

  if (errorJornada) {
    console.log('Error fetching Jornada: ', errorJornada);
  }

  if (dataJornada && dataJornada.length > 0) {
    for (let i = 0; i < dataJornada.length; i++) {
      fechas.push(dataJornada[i].date);
    }
  }

  return (
    <>
      <ContainerOptions urlExportar={'#'} usuarios={false} />
      {
        fechas.map((fecha) => {
          return <EntradasFichajes key={fecha} date={fecha} profile={profile} />
        })
      }

    </>
  );
}