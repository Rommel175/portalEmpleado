import styles from './layout.module.css'
import NavbarPerfil from '@/components/perfil/NavbarPerfil';
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';
import Navbar from '@/components/navbar/Navbar';
import ActividadCard from '@/components/cards/Actividad';
import { getTotalHoras, getUserData } from '@/lib/getSupabaseData';

export default async function PerfilLayout({ children }: { children: React.ReactNode }) {

  const { profile, fichaje, eventos } = await getUserData();

  const totalHoras = await getTotalHoras();

  function formatHoras(horasDecimales: number): string {
    const horas = Math.floor(horasDecimales);
    const minutos = Math.round((horasDecimales - horas) * 60);
    return `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}`;
  }

  return (
    <>
      <Navbar image={profile.image} title='Perfil' />
      <ContainerSuperior profile={profile} fichaje={fichaje} eventos={eventos} />

      <div style={{ display: 'flex', width: '100%' }}>
        <ActividadCard horas={formatHoras(totalHoras)} total={profile.horas_semana} />
      </div>

      <div className={styles.content}>
        <NavbarPerfil />
        <div className={styles.mainContent}>
          {children}
        </div>
      </div>

    </>
  );
}
