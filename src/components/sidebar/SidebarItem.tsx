'use client'

import Link from 'next/link';
import styles from './sidebarItem.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function SidebarItemComponent() {
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

      <Link href={'/dashboard/perfil/fichajes'} className={`${(pathname == '/dashboard/perfil/fichajes' || pathname == '/dashboard/perfil/vacaciones' || pathname == '/dashboard/perfil/solicitudes') ? styles.active : ""}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M12.0505 3.948C11.0427 3.948 10.0762 4.34835 9.36355 5.06099C8.65091 5.77362 8.25056 6.74016 8.25056 7.74797C8.25056 8.75579 8.65091 9.72233 9.36355 10.435C10.0762 11.1476 11.0427 11.5479 12.0505 11.5479C13.0584 11.5479 14.0249 11.1476 14.7375 10.435C15.4502 9.72233 15.8505 8.75579 15.8505 7.74797C15.8505 6.74016 15.4502 5.77362 14.7375 5.06099C14.0249 4.34835 13.0584 3.948 12.0505 3.948ZM9.45055 7.74797C9.45055 7.05842 9.72448 6.3971 10.2121 5.90951C10.6997 5.42192 11.361 5.14799 12.0505 5.14799C12.7401 5.14799 13.4014 5.42192 13.889 5.90951C14.3766 6.3971 14.6505 7.05842 14.6505 7.74797C14.6505 8.43753 14.3766 9.09885 13.889 9.58644C13.4014 10.074 12.7401 10.348 12.0505 10.348C11.361 10.348 10.6997 10.074 10.2121 9.58644C9.72448 9.09885 9.45055 8.43753 9.45055 7.74797ZM12.0505 12.0095C10.2001 12.0095 8.49456 12.4303 7.23137 13.1407C5.98658 13.8415 5.05058 14.9023 5.05058 16.2095V16.2911C5.04978 17.2207 5.04898 18.387 6.07218 19.2206C6.57537 19.6302 7.28017 19.9222 8.23216 20.1142C9.18576 20.3078 10.4297 20.4094 12.0505 20.4094C13.6713 20.4094 14.9145 20.3078 15.8697 20.1142C16.8217 19.9222 17.5257 19.6302 18.0297 19.2206C19.0529 18.387 19.0513 17.2207 19.0505 16.2911V16.2095C19.0505 14.9023 18.1145 13.8415 16.8705 13.1407C15.6065 12.4303 13.9017 12.0095 12.0505 12.0095ZM6.25057 16.2095C6.25057 15.5287 6.74817 14.7895 7.81936 14.1871C8.87216 13.5951 10.3665 13.2095 12.0513 13.2095C13.7345 13.2095 15.2289 13.5951 16.2817 14.1871C17.3537 14.7895 17.8505 15.5287 17.8505 16.2095C17.8505 17.2559 17.8185 17.8446 17.2713 18.2894C16.9753 18.531 16.4793 18.767 15.6313 18.9382C14.7857 19.1094 13.6297 19.2094 12.0505 19.2094C10.4713 19.2094 9.31455 19.1094 8.46976 18.9382C7.62177 18.767 7.12577 18.531 6.82977 18.2902C6.28257 17.8446 6.25057 17.2559 6.25057 16.2095Z" fill={(pathname == '/dashboard/perfil/fichajes' || pathname == '/dashboard/perfil/vacaciones' || pathname == '/dashboard/perfil/solicitudes') ? 'white' : '#0B3C70'} />
        </svg>
        Perfil
      </Link>

      <Link href={'/dashboard/archivos'} className={`${(pathname == '/dashboard/archivos') ? styles.active : ""}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 7.69135C5 6.31677 5 5.62949 5.42778 5.20343C5.85322 4.77582 6.54078 4.77582 7.91667 4.77582C9.29178 4.77582 9.97933 4.77582 10.4056 5.20343C10.8333 5.62949 10.8333 6.31677 10.8333 7.69135C10.8333 9.06593 10.8333 9.75322 10.4056 10.1793C9.97933 10.6069 9.29178 10.6069 7.91667 10.6069C6.54156 10.6069 5.854 10.6069 5.42778 10.1793C5 9.75399 5 9.0667 5 7.69135ZM5 15.8603C5 14.4857 5 13.7984 5.42778 13.3724C5.854 12.9448 6.54156 12.9448 7.91667 12.9448C9.29178 12.9448 9.97933 12.9448 10.4056 13.3724C10.8333 13.7984 10.8333 14.4857 10.8333 15.8603C10.8333 17.2349 10.8333 17.9222 10.4056 18.3482C9.97933 18.7758 9.29178 18.7758 7.91667 18.7758C6.54156 18.7758 5.854 18.7758 5.42778 18.3482C5 17.9229 5 17.2349 5 15.8603ZM13.1667 7.69135C13.1667 6.31677 13.1667 5.62949 13.5944 5.20343C14.0207 4.77582 14.7082 4.77582 16.0833 4.77582C17.4584 4.77582 18.146 4.77582 18.5722 5.20343C19 5.62949 19 6.31677 19 7.69135C19 9.06593 19 9.75322 18.5722 10.1793C18.146 10.6069 17.4584 10.6069 16.0833 10.6069C14.7082 10.6069 14.0207 10.6069 13.5944 10.1793C13.1667 9.75322 13.1667 9.06593 13.1667 7.69135ZM13.1667 15.8603C13.1667 14.4857 13.1667 13.7984 13.5944 13.3724C14.0207 12.9448 14.7082 12.9448 16.0833 12.9448C17.4584 12.9448 18.146 12.9448 18.5722 13.3724C19 13.7984 19 14.4857 19 15.8603C19 17.2349 19 17.9222 18.5722 18.3482C18.146 18.7758 17.4584 18.7758 16.0833 18.7758C14.7082 18.7758 14.0207 18.7758 13.5944 18.3482C13.1667 17.9222 13.1667 17.2349 13.1667 15.8603Z" stroke={(pathname == '/dashboard/archivos') ? 'white' : '#0B3C70'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Archivos
      </Link>

      <Link href={'/dashboard/recursos/incidencias'} className={`${(pathname == '/dashboard/recursos/incidencias' || pathname == '/dashboard/recursos/solicitudes') ? styles.active : ""}`}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.84905 17.2086V8.51848M15.0631 17.2086V3.30444M4.63501 17.2086V13.7325" stroke={(pathname == '/dashboard/recursos/incidencias' || pathname == '/dashboard/recursos/solicitudes') ? 'white' : '#0B3C70'} strokeWidth="2.16092" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Recursos Humanos
      </Link>

      <Link href={'/dashboard/reportes'} className={`${(pathname == '/dashboard/reportes') ? styles.active : ""}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 7.69135C5 6.31677 5 5.62949 5.42778 5.20343C5.85322 4.77582 6.54078 4.77582 7.91667 4.77582C9.29178 4.77582 9.97933 4.77582 10.4056 5.20343C10.8333 5.62949 10.8333 6.31677 10.8333 7.69135C10.8333 9.06593 10.8333 9.75322 10.4056 10.1793C9.97933 10.6069 9.29178 10.6069 7.91667 10.6069C6.54156 10.6069 5.854 10.6069 5.42778 10.1793C5 9.75399 5 9.0667 5 7.69135ZM5 15.8603C5 14.4857 5 13.7984 5.42778 13.3724C5.854 12.9448 6.54156 12.9448 7.91667 12.9448C9.29178 12.9448 9.97933 12.9448 10.4056 13.3724C10.8333 13.7984 10.8333 14.4857 10.8333 15.8603C10.8333 17.2349 10.8333 17.9222 10.4056 18.3482C9.97933 18.7758 9.29178 18.7758 7.91667 18.7758C6.54156 18.7758 5.854 18.7758 5.42778 18.3482C5 17.9229 5 17.2349 5 15.8603ZM13.1667 7.69135C13.1667 6.31677 13.1667 5.62949 13.5944 5.20343C14.0207 4.77582 14.7082 4.77582 16.0833 4.77582C17.4584 4.77582 18.146 4.77582 18.5722 5.20343C19 5.62949 19 6.31677 19 7.69135C19 9.06593 19 9.75322 18.5722 10.1793C18.146 10.6069 17.4584 10.6069 16.0833 10.6069C14.7082 10.6069 14.0207 10.6069 13.5944 10.1793C13.1667 9.75322 13.1667 9.06593 13.1667 7.69135ZM13.1667 15.8603C13.1667 14.4857 13.1667 13.7984 13.5944 13.3724C14.0207 12.9448 14.7082 12.9448 16.0833 12.9448C17.4584 12.9448 18.146 12.9448 18.5722 13.3724C19 13.7984 19 14.4857 19 15.8603C19 17.2349 19 17.9222 18.5722 18.3482C18.146 18.7758 17.4584 18.7758 16.0833 18.7758C14.7082 18.7758 14.0207 18.7758 13.5944 18.3482C13.1667 17.9222 13.1667 17.2349 13.1667 15.8603Z" stroke={(pathname == '/dashboard/reportes') ? 'white' : '#0B3C70'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Reportes
      </Link>

      <button onClick={handleLogOut}>Cerrar sesión</button>
    </div>
  );
}