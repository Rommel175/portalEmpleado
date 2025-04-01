import ReportesCard from '@/components/recursos/reportes/ReportesCard';
import styles from './incidencias.module.css'
import ContainerHeader from '@/components/containers/ContainerHeader'

export default function Incidencias() {
  return (
    <div className={styles.container}>
      <ContainerHeader name='Reportes' />
      <div className={styles.content}>
        <ReportesCard />
        <ReportesCard />
        <ReportesCard />
      </div>
    </div>
  );
}