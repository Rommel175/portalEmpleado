import { createClient } from '@/utils/supabase/server';
import styles from './layout.module.css'
import { redirect } from 'next/navigation';
import NavbarPerfil from '@/components/perfil/NavbarPerfil';
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';

export default async function PerfilLayout({ children }: { children: React.ReactNode }) {
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

  const startDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 1);

  const { data: dataFichaje, error: errorFichaje } = await supabase
    .from('fichaje_jornada')
    .select('*')
    .gte('date', startDate.toISOString())
    .lt('date', endDate.toISOString())
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

  return (
    <>
      <ContainerSuperior profile={profile} fichaje={fichaje} eventos={eventos} />

      <div className={styles.content}>
        <NavbarPerfil />
        <div className={styles.mainContent}>
          {children}
        </div>
      </div>

    </>
  );
}
