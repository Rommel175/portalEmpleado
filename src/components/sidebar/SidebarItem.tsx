'use client'

import Link from 'next/link';
import styles from './sidebarItem.module.css';
import { usePathname } from 'next/navigation';

export default function SidebarItemComponent({ is_admin }: { is_admin: boolean }) {
  const pathname = usePathname();

  return (
    <>
      {
        (!is_admin) &&
        <div className={styles.options}>
          <Link href={'/dashboard/inicio'} className={`${(pathname == '/dashboard/inicio') ? styles.active : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path d="M10.333 15.5001V9.60526C10.333 9.40984 10.2511 9.22242 10.1052 9.08423C9.95938 8.94604 9.76155 8.86841 9.55527 8.86841H6.44416C6.23788 8.86841 6.04005 8.94604 5.89419 9.08423C5.74833 9.22242 5.66638 9.40984 5.66638 9.60526V15.5001" stroke={(pathname == '/dashboard/inicio') ? 'white' : '#0B3C70'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M0.999878 7.39446C0.999824 7.18008 1.04914 6.96828 1.14438 6.77382C1.23962 6.57936 1.3785 6.40692 1.55132 6.26854L6.99577 1.84815C7.27653 1.62334 7.63227 1.5 7.99988 1.5C8.36749 1.5 8.72322 1.62334 9.00399 1.84815L14.4484 6.26854C14.6213 6.40692 14.7601 6.57936 14.8554 6.77382C14.9506 6.96828 14.9999 7.18008 14.9999 7.39446V14.0262C14.9999 14.417 14.836 14.7919 14.5443 15.0682C14.2525 15.3446 13.8569 15.4999 13.4443 15.4999H2.55543C2.14287 15.4999 1.74721 15.3446 1.45549 15.0682C1.16377 14.7919 0.999878 14.417 0.999878 14.0262V7.39446Z" stroke={(pathname == '/dashboard/inicio') ? 'white' : '#0B3C70'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Inicio
          </Link>

          <Link href={'/dashboard/perfil/fichajes'} className={`${(pathname == '/dashboard/perfil/fichajes' || pathname == '/dashboard/perfil/vacaciones' || pathname == '/dashboard/perfil/solicitudes') || pathname == '/dashboard/editar_perfil' || pathname.startsWith('/dashboard/editar_perfil/') ? styles.active : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
              <path d="M9.99988 10.7246C11.745 10.7246 13.3337 11.1223 14.494 11.7744V11.7734C15.6483 12.4237 16.4149 13.3512 16.4149 14.418V14.4971L16.413 14.8438C16.4001 15.5949 16.3103 16.335 15.7128 16.9131L15.5663 17.043C15.1962 17.3437 14.6777 17.5848 13.9569 17.7607L13.6356 17.832H13.6346C12.7416 18.013 11.5618 18.1113 9.99988 18.1113C8.63296 18.1113 7.55827 18.0356 6.71375 17.8955L6.36609 17.832H6.36511C5.58528 17.6747 5.0154 17.4513 4.60242 17.168L4.43445 17.043C3.60043 16.3633 3.58404 15.4207 3.58484 14.4971V14.418C3.58484 13.3514 4.35097 12.4237 5.50574 11.7734L5.50671 11.7744C6.66617 11.1224 8.25551 10.7246 9.99988 10.7246ZM10.0009 11.1133C8.41463 11.1133 6.97879 11.4527 5.90613 12.001L5.69714 12.1133C4.59834 12.7312 3.97351 13.5545 3.97351 14.418C3.97351 15.3374 3.98226 16.0765 4.5575 16.6328L4.67957 16.7422H4.68054C4.99088 16.9945 5.4503 17.2155 6.13464 17.3828L6.44226 17.4512C7.2987 17.6247 8.45163 17.7227 9.99988 17.7227C11.3549 17.7227 12.4066 17.6477 13.2225 17.5127L13.5575 17.4512C14.4146 17.2781 14.9642 17.0306 15.3192 16.7412C16.0163 16.1746 16.0262 15.3984 16.0262 14.418C16.0262 13.5546 15.4025 12.7313 14.3026 12.1133H14.3036C13.2121 11.4995 11.6911 11.1133 10.0009 11.1133ZM9.99988 2.88867C10.8216 2.88867 11.6115 3.19522 12.2177 3.74414L12.3368 3.85645C12.9565 4.47615 13.3045 5.31697 13.3046 6.19336C13.3046 7.01484 12.9988 7.80499 12.4501 8.41113L12.3368 8.53027C11.7171 9.15 10.8763 9.49805 9.99988 9.49805C9.17837 9.49803 8.38825 9.19228 7.7821 8.64355L7.66296 8.53027C7.04329 7.91055 6.69519 7.06975 6.69519 6.19336C6.69521 5.37167 7.0017 4.58177 7.55066 3.97559L7.66296 3.85645C8.28267 3.23674 9.12348 2.88869 9.99988 2.88867ZM9.99988 3.27734C9.22654 3.27736 8.48519 3.58501 7.93835 4.13184C7.39152 4.67867 7.08389 5.42003 7.08386 6.19336C7.08386 6.96673 7.3915 7.709 7.93835 8.25586C8.48515 8.80244 9.22672 9.10936 9.99988 9.10938C10.773 9.10938 11.5146 8.80242 12.0614 8.25586C12.6083 7.709 12.9159 6.96673 12.9159 6.19336C12.9159 5.42003 12.6082 4.67867 12.0614 4.13184C11.5146 3.58503 10.7732 3.27734 9.99988 3.27734Z" fill={(pathname == '/dashboard/perfil/fichajes' || pathname == '/dashboard/perfil/vacaciones' || pathname == '/dashboard/perfil/solicitudes') || pathname == '/dashboard/editar_perfil' || pathname.startsWith('/dashboard/editar_perfil/') ? 'white' : '#0B3C70'} stroke={(pathname == '/dashboard/perfil/fichajes' || pathname == '/dashboard/perfil/vacaciones' || pathname == '/dashboard/perfil/solicitudes') || pathname == '/dashboard/editar_perfil' || pathname.startsWith('/dashboard/editar_perfil/') ? 'white' : '#0B3C70'} strokeWidth="0.777778" />
            </svg>
            Perfil
          </Link>

          <Link href={'/dashboard/archivos'} className={`${(pathname == '/dashboard/archivos') ? styles.active : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 21" fill="none">
              <path d="M17.7083 8.73586V15.1509C17.7083 15.8322 17.4376 16.4857 16.9558 16.9675C16.474 17.4494 15.8205 17.72 15.1391 17.72H4.86079C4.17941 17.72 3.52593 17.4494 3.04412 16.9675C2.56231 16.4857 2.29163 15.8322 2.29163 15.1509V5.8492C2.29163 5.16781 2.56231 4.51433 3.04412 4.03252C3.52593 3.55071 4.17941 3.28003 4.86079 3.28003H7.43079C7.85478 3.27953 8.27229 3.38407 8.64601 3.58431C9.01973 3.78455 9.33803 4.07425 9.57246 4.42753L10.3 5.53253C10.4335 5.73003 10.6133 5.8918 10.8238 6.00366C11.0344 6.11553 11.2691 6.17408 11.5075 6.1742H15.1391C15.8191 6.17441 16.4714 6.44414 16.9529 6.92428C17.4345 7.40442 17.7061 8.05585 17.7083 8.73586Z" stroke={(pathname == '/dashboard/archivos') ? 'white' : '#0B3C70'} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Archivos
          </Link>
        </div>
      }
      {
        (is_admin) &&
        <div className={styles.options}>
          <Link href={'/dashboard/recursos/gestion'} className={`${(pathname == '/dashboard/recursos/gestion' || pathname == '/dashboard/recursos/informes' || pathname.startsWith('/dashboard/recursos/informes/') || pathname == '/dashboard/recursos/incidencias' || pathname == '/dashboard/recursos/comentarios') ? styles.active : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
              <path d="M10.25 17.5V8.75M15.5 17.5V3.5M5 17.5V14" stroke={(pathname == '/dashboard/recursos/gestion' || pathname == '/dashboard/recursos/informes' || pathname.startsWith('/dashboard/recursos/informes/') || pathname == '/dashboard/recursos/incidencias' || pathname == '/dashboard/recursos/comentarios') ? 'white' : '#0B3C70'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Recursos Humanos
          </Link>
        </div>
      }
    </>

  );
}