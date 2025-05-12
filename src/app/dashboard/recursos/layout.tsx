import NavbarRecursos from '@/components/recursos/NavbarRecursos';
import styles from './layput.module.css'
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';
import { getUserData } from '@/lib/getSupabaseData';

export default async function RecursosLayout({ children }: { children: React.ReactNode; }) {
  const { profile, fichaje, eventos } = await getUserData();

  return (
    <>
      <div style={{ display: 'none' }}>
        <ContainerSuperior profile={profile} fichaje={fichaje} eventos={eventos} />
      </div>
      
      <div className={styles.wraper}>
        <NavbarRecursos />
        {children}
      </div>
    </>
  );
}