import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Modal from '@/components/inicio/Modal';
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';
import ContainerEquipo from '@/components/containers/equipo/ContainerEquipo';

export default async function HomePage() {

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect('/login')
  }

  const { data: dataProfile, error: errorProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id);

  if (errorProfile) {
    console.log('Error fetching profiles: ', errorProfile);
  }

  let profile = [];

  if (dataProfile && dataProfile.length > 0) {
    profile = dataProfile && dataProfile.length > 0 ? dataProfile : [];
  } else {
    await supabase.auth.signOut();
    redirect('/login')
  }

  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const { data: dataFichaje, error: errorFichaje } = await supabase
    .from('fichaje_jornada')
    .select('*')
    .eq('created_at', `${year}-${month}-${day}`)
    .eq('profile_id', profile[0].id);

  if (errorFichaje) {
    console.log('Error fetching fichaje: ', errorFichaje);
  }

  const fichaje = dataFichaje && dataFichaje.length > 0 ? dataFichaje : [];

  let eventos = [];

  if (fichaje && fichaje.length > 0) {
    const { data: dataEventos, error: errorEventos } = await supabase
      .from('fichaje_eventos')
      .select('*')
      .eq('fichaje_id', fichaje[0].id)

    if (errorEventos) {
      console.log('Error fetching Eventos: ', errorEventos);
    }

    eventos = dataEventos && dataEventos.length > 0 ? dataEventos : [];
  }


  const { data: dataEquipo, error: errorEquipo } = await supabase
    .from('profiles')
    .select('id, full_name, email, image, estado, fichaje_jornada(id, hora_aprox_salida, created_at, hora, total_trabajado, profile_id, fichaje_eventos(*))')
    .neq('user_id', user.id);

  if (errorEquipo) {
    console.log('Error equipo: ', errorEquipo);
  }

  const equipo = dataEquipo && dataEquipo.length > 0 ? dataEquipo : [];


  return (
    <>
      <Modal profile={profile} fichaje={fichaje} />
      <ContainerSuperior fichaje={fichaje} eventos={eventos} profile={profile} />
      <ContainerEquipo equipo={equipo} />
    </>
  );
}