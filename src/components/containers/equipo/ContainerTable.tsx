import styles from './containerTable.module.css'
import TableItem from './TableItem';

export default function ContainerTable() {
  return (
    <div className={styles.table}>
      <div className={styles.tableNav}>
        <h3>Usuario</h3>
        <h3>Estado</h3>
        <h3>Localización</h3>
        <h3>Inicio Jornada</h3>
        <h3>Final Jornada</h3>
      </div>
      <TableItem name='Jane Cooper' email='jane.cooper@example.com' estado='Activo' localizacion='Casa' inicio='08:27'/>
      <TableItem name='Jane Cooper' email='jane.cooper@example.com'/>
      <TableItem name='Rommel Romero' email='rommel.xana@gmail.com' foto='https://lh3.googleusercontent.com/a/ACg8ocJw-cwSFkgnKO0KFi-uhTHogucMnwh5aEAeTzyj86gExsAyclToJA=s96-c' estado='Pausa' localizacion='Oficina' inicio='09:00' final='15:30'/>
      <TableItem name='Jane Cooper' email='jane.cooper@example.com' estado='Vacaciones'/>
      <TableItem name='Jane Cooper' email='jane.cooper@example.com' estado='Inactivo'/>
    </div>
  );
}