import styles from './layout.module.css'
import NavbarPerfil from '@/components/perfil/NavbarPerfil';
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';
import Navbar from '@/components/navbar/Navbar';
import { getUserData } from '@/lib/getSupabaseData';

export default async function PerfilLayout({ children }: { children: React.ReactNode }) {

  const { profile, fichaje, eventos } = await getUserData();

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
