import IncidenciasCard from '@/components/recursos/incidencias/IncidenciasCard';
import styles from './incidencias.module.css'

export default function Incidencias() {
  return (
    <div className={styles.container}>
      <IncidenciasCard />
      <IncidenciasCard />
      <IncidenciasCard />
    </div>
  );
}