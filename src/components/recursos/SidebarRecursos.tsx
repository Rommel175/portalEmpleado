'use client'

import Link from 'next/link';
import styles from './sidebarRecursos.module.css'
import { usePathname } from 'next/navigation';

export default function SidebarRecursos() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <Link href={'/dashboard/recursos/incidencias'} className={(pathname == '/dashboard/recursos/incidencias') ? styles.active : ''}>Incidencias <span>4</span></Link>
      <Link href={'/dashboard/recursos/solicitudes'} className={(pathname == '/dashboard/recursos/solicitudes') ? styles.active : ''}>Solicitudes vacaciones</Link>
    </nav>
  );
}