import Link from 'next/link';
import styles from './navItem.module.css';

export default function NavItemComponent() {
  return (
    <div className={styles.options}>
      <Link href={'/'}>Inicio</Link>
      <Link href={'/planificacion'}>Planificación</Link>
      <Link href={'/archivos'}>Archivos</Link>
    </div>
  );
}