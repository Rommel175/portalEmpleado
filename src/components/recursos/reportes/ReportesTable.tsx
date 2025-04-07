import styles from './reportesTable.module.css'
import ReportesTableItem from './ReportesTableItem';

export default function ReportesTable() {
  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <h2>Usuarios</h2>
        <h2>Horas semanales</h2>
        <div className={styles.empty}></div>
      </div>
      <ReportesTableItem />
      <ReportesTableItem />
      <ReportesTableItem />
      <ReportesTableItem />
    </div>
  );
}