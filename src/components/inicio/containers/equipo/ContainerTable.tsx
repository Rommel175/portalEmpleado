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
      <TableItem name='Jane Cooper' email='jane.cooper@example.com' foto='https://s3-alpha-sig.figma.com/img/4838/ebf9/9f5d3b04e54d4bda4b727af5ea1e799c?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=OjuiJ9iriZqqOE72l-KP6Dww0UyXc9B5~oomNe-ku1QR-WKTmgYEk~XR4Yy~5V~MbI19w6OyflPM11uPMCXcOxWsYqgjnPTMgz5l785OXlhQxdNPb7xWGmmsO7psdWTdWejBEqynsfqy28~m-GrAtXwhyY3~yo0qiWLyWbQnE3BiSjX0DE30oP3BESuhfHg~v5JAL~DlY8Px5Yty9JsxP5PRJ014RJ6fs4RoQsa9Yu-vyhzBZxaxfqHlg~v61lNCuGBSOxhbrI3QSGkXtdWzW7W9KJMTWdSwNJ7MTQFCUN1~rkYYt5EQEP2C2~f~EwrhSlBisU23jSN4wFepiWJ2gw' estado='Activo' localizacion='Casa' inicio='08:27'/>
      <TableItem name='Jane Cooper' email='jane.cooper@example.com'/>
      <TableItem name='Rommel Romero' email='rommel.xana@gmail.com' foto='https://lh3.googleusercontent.com/a/ACg8ocJw-cwSFkgnKO0KFi-uhTHogucMnwh5aEAeTzyj86gExsAyclToJA=s96-c' estado='Pausa' localizacion='Oficina' inicio='09:00' final='15:30'/>
    </div>
  );
}