import styles from './containerDate.module.css'

export default function DateContainer() {
  return (
    <div className={styles.container}>
      <h3>11 de marzo de 2025</h3>
      <div className={styles.counter}>
        <h2>00:00:00</h2>
      </div>
    </div>
    
  );
}