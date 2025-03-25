import NavHomePage from '@/components/inicio/NavInicio';
import styles from './inicio.module.css';
import ContainerDatos from '@/components/inicio/containers/datos/ContainerDatos';
import ContainerFichaje from '@/components/inicio/containers/fichaje/ContainerFichaje';
import ContainerEquipo from '@/components/inicio/containers/equipo/ContainerEquipo';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';


export default async function HomePage() {

  const supabase = createClient();
  const { data } = await (await supabase).auth.getUser();
  const user = data.user;

  if (!user) {
    redirect('/login')
  }

  return (
    <div className={styles.wraper}>
      <NavHomePage user={user}/>
      <section className={styles.containerSuperior}>
        <ContainerDatos user={user}/>

        <ContainerFichaje />
      </section>
      
      <ContainerEquipo />

    </div>
  );
}