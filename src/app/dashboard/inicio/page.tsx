import styles from './inicio.module.css';
import Modal from '@/components/inicio/Modal';
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';
import ContainerEquipo from '@/components/containers/equipo/ContainerEquipo';
import { getUserData } from '@/lib/getSupabaseData';
import ActividadSemanal from '@/components/dashboards/actividadSemanal/ActividadSemanal';
import Links from '@/components/dashboards/links/Links';
import Vacaciones from '@/components/dashboards/vacaciones/Vacaciones';

export default async function HomePage() {

  const { profile, fichaje, eventos, equipo } = await getUserData();

  return (
    <>
      <Modal profile={profile} />
      <ContainerSuperior fichaje={fichaje} eventos={eventos} profile={profile} />
      <div className={styles.cards}>
        <ActividadSemanal />
        <Links />
        <Vacaciones />
      </div>
      
      <ContainerEquipo equipo={equipo} />
    </>
  );
}