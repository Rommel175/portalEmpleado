import Modal from '@/components/inicio/Modal';
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';
import ContainerEquipo from '@/components/containers/equipo/ContainerEquipo';
import { getUserData } from '@/lib/getSupabaseData';

export default async function HomePage() {

  const { profile, fichaje, eventos, equipo } = await getUserData();

  return (
    <>
      <Modal profile={profile} />
      <ContainerSuperior fichaje={fichaje} eventos={eventos} profile={profile} />
      <ContainerEquipo equipo={equipo} />
    </>
  );
}