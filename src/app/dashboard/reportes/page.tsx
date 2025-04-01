import ContainerOptions from '@/components/containers/ContainerOptions';
import styles from './reportes.module.css'
import ContainerHeader from '@/components/containers/ContainerHeader'
import ReportesTable from '@/components/reportes/ReportesTable';

export default function ReportesPage() {
  return (
    <div className={styles.container}>
      <ContainerHeader name='Reportes' />
      <div className={styles.content}>

        <ContainerOptions option2={false} />

        <form className={styles.filtrosForm}>
          <div>
            <label htmlFor="filtro">Filtros</label>
            <select name="filtro">
              <option value="0">Usuarios</option>
            </select>
          </div>
          <button type='reset'>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 11L8 8M8 8L11 5M8 8L5 5M8 8L11 11" stroke="#0B3C70" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Limpiar Filros
          </button>
        </form>

        <ReportesTable />

      </div>
    </div>
  );
}