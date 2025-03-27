import styles from './inicio.module.css';
import ContainerDatos from '@/components/containers/datos/ContainerDatos';
import ContainerFichaje from '@/components/containers/fichaje/ContainerFichaje';
import ContainerEquipo from '@/components/containers/equipo/ContainerEquipo';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';


export default async function HomePage() {

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
    const user = data.user;

  if (!user) {
    redirect('/login')
  }

  return (
    <div className={styles.wraper}>
      <Navbar user={user} />
      <section className={styles.containerSuperior}>
        <ContainerDatos user={user}/>

        <ContainerFichaje />
      </section>
      
      <ContainerEquipo />

    </div>
  );
}