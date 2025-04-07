import ContainerOptions from '@/components/containers/ContainerOptions';
import styles from './reportes.module.css'
import ReportesTable from '@/components/recursos/reportes/ReportesTable';

export default function ReportesPage() {
  return (
    <div className={styles.container}>
      <ContainerOptions ubicacion={false} tipoRegistro={false} urlExportar='#' recientes={false}/>
      <ReportesTable />
    </div>
  );
}