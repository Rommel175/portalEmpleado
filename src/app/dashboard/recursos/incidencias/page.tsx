import IncidenciasCard from '@/components/recursos/incidencias/IncidenciasCard';
import styles from './incidencias.module.css'
import ContainerHeader from '@/components/containers/ContainerHeader'

export default function Incidencias() {
  return (
    <div className={styles.container}>
      <ContainerHeader name='Reportes' />
      <div className={styles.content}>
        <IncidenciasCard />
        <IncidenciasCard />
        <IncidenciasCard />
      </div>
    </div>
  );
}