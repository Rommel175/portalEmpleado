'use client'

import Link from 'next/link';
import styles from './navItem.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NavItemComponent() {
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  async function handleLogOut() {
    await supabase.auth.signOut();
    router.push('/login')
  }

  return (
    <div className={styles.options}>
      <Link href={'/dashboard/inicio'} className={`${(pathname == '/dashboard/inicio') ? styles.active : ""}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.2223 18.6668V13.0527C14.2223 12.8665 14.1442 12.688 14.0053 12.5564C13.8664 12.4248 13.678 12.3509 13.4815 12.3509H10.5186C10.3221 12.3509 10.1337 12.4248 9.99479 12.5564C9.85587 12.688 9.77783 12.8665 9.77783 13.0527V18.6668" stroke={(pathname == '/dashboard/inicio') ? 'white' : '#0B3C70'} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.33325 10.9471C5.3332 10.7429 5.38017 10.5412 5.47087 10.356C5.56158 10.1708 5.69384 10.0066 5.85844 9.87478L11.0436 5.66488C11.311 5.45078 11.6498 5.33331 11.9999 5.33331C12.35 5.33331 12.6888 5.45078 12.9562 5.66488L18.1414 9.87478C18.306 10.0066 18.4383 10.1708 18.529 10.356C18.6197 10.5412 18.6666 10.7429 18.6666 10.9471V17.263C18.6666 17.6352 18.5105 17.9922 18.2327 18.2554C17.9548 18.5186 17.578 18.6665 17.1851 18.6665H6.81473C6.42182 18.6665 6.045 18.5186 5.76717 18.2554C5.48934 17.9922 5.33325 17.6352 5.33325 17.263V10.9471Z" stroke={(pathname == '/dashboard/inicio') ? 'white' : '#0B3C70'} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Inicio
      </Link>

      <Link href={'/dashboard/planificacion'} className={`${(pathname == '/dashboard/planificacion') ? styles.active : ""}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.4165 11.0833L11.9165 13.5833L18.5832 6.91663" stroke={(pathname == '/dashboard/planificacion') ? 'white' : '#0B3C70'} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.5833 11.9167V16.9167C18.5833 17.3587 18.4077 17.7826 18.0952 18.0952C17.7826 18.4077 17.3587 18.5833 16.9167 18.5833H6.91667C6.47464 18.5833 6.05072 18.4077 5.73816 18.0952C5.42559 17.7826 5.25 17.3587 5.25 16.9167V6.91667C5.25 6.47464 5.42559 6.05072 5.73816 5.73816C6.05072 5.42559 6.47464 5.25 6.91667 5.25H14.4167" stroke={(pathname == '/dashboard/planificacion') ? 'white' : '#0B3C70'} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Planificación
      </Link>

      <Link href={'/dashboard/archivos'} className={`${(pathname == '/dashboard/archivos') ? styles.active : ""}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 7.69135C5 6.31677 5 5.62949 5.42778 5.20343C5.85322 4.77582 6.54078 4.77582 7.91667 4.77582C9.29178 4.77582 9.97933 4.77582 10.4056 5.20343C10.8333 5.62949 10.8333 6.31677 10.8333 7.69135C10.8333 9.06593 10.8333 9.75322 10.4056 10.1793C9.97933 10.6069 9.29178 10.6069 7.91667 10.6069C6.54156 10.6069 5.854 10.6069 5.42778 10.1793C5 9.75399 5 9.0667 5 7.69135ZM5 15.8603C5 14.4857 5 13.7984 5.42778 13.3724C5.854 12.9448 6.54156 12.9448 7.91667 12.9448C9.29178 12.9448 9.97933 12.9448 10.4056 13.3724C10.8333 13.7984 10.8333 14.4857 10.8333 15.8603C10.8333 17.2349 10.8333 17.9222 10.4056 18.3482C9.97933 18.7758 9.29178 18.7758 7.91667 18.7758C6.54156 18.7758 5.854 18.7758 5.42778 18.3482C5 17.9229 5 17.2349 5 15.8603ZM13.1667 7.69135C13.1667 6.31677 13.1667 5.62949 13.5944 5.20343C14.0207 4.77582 14.7082 4.77582 16.0833 4.77582C17.4584 4.77582 18.146 4.77582 18.5722 5.20343C19 5.62949 19 6.31677 19 7.69135C19 9.06593 19 9.75322 18.5722 10.1793C18.146 10.6069 17.4584 10.6069 16.0833 10.6069C14.7082 10.6069 14.0207 10.6069 13.5944 10.1793C13.1667 9.75322 13.1667 9.06593 13.1667 7.69135ZM13.1667 15.8603C13.1667 14.4857 13.1667 13.7984 13.5944 13.3724C14.0207 12.9448 14.7082 12.9448 16.0833 12.9448C17.4584 12.9448 18.146 12.9448 18.5722 13.3724C19 13.7984 19 14.4857 19 15.8603C19 17.2349 19 17.9222 18.5722 18.3482C18.146 18.7758 17.4584 18.7758 16.0833 18.7758C14.7082 18.7758 14.0207 18.7758 13.5944 18.3482C13.1667 17.9222 13.1667 17.2349 13.1667 15.8603Z" stroke={(pathname == '/dashboard/archivos') ? 'white' : '#0B3C70'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Archivos
      </Link>

      <button onClick={handleLogOut}>Cerrar sesión</button>
    </div>
  );
}