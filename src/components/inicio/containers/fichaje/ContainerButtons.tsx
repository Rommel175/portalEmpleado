import styles from './containerButtons.module.css'

export default function ButtonsContainer() {
  return (
    <div className={styles.container}>
      <button className={styles.entrada}>FICHAR ENTRADA</button>
      <button className={styles.pausa}>PAUSA</button>
      <button className={styles.salida}>SALIDA</button>
    </div>
  );
}