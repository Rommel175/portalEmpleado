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

  return (
    <>
      <Modal user={user}/>
      <ContainerSuperior user={user}/>
      <ContainerEquipo user={user}/>
    </>
  );
}