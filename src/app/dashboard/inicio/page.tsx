import styles from './inicio.module.css';
import ContainerDatos from '@/components/containers/datos/ContainerDatos';
import ContainerFichaje from '@/components/containers/fichaje/ContainerFichaje';
import ContainerEquipo from '@/components/containers/equipo/ContainerEquipo';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Modal from '@/components/inicio/Modal';

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
      <div className={styles.containerSuperior}>
        <ContainerDatos user={user} />

        <ContainerFichaje />
      </div>

      <ContainerEquipo />

    </>
  );
}