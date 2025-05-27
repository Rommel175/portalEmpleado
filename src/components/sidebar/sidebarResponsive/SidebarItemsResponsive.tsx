'use client'

import Link from 'next/link';
import styles from './sidebarItemsResponsive.module.css';
import { usePathname } from 'next/navigation';

export default function SidebarItemsResponsive({ is_admin }: { is_admin: boolean }) {
    const pathname = usePathname();

    return (
        <>
            {
                (!is_admin) &&
                <>
                    <Link href={'/dashboard/inicio'} className={`${(pathname == '/dashboard/inicio') ? styles.itemActive : styles.item}`}>
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
                            <path d="M12.3344 17.8421V10.7683C12.3344 10.5337 12.236 10.3088 12.061 10.143C11.886 9.97719 11.6486 9.88403 11.401 9.88403H7.66771C7.42017 9.88403 7.18278 9.97719 7.00774 10.143C6.83271 10.3088 6.73438 10.5337 6.73438 10.7683V17.8421" stroke={(pathname == '/dashboard/inicio') ? '#0B3C70' : '#B6BEC9 '} strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M1.13477 8.11534C1.1347 7.85809 1.19388 7.60393 1.30817 7.37057C1.42246 7.13722 1.58911 6.9303 1.7965 6.76425L8.32983 1.45977C8.66675 1.19 9.09363 1.04199 9.53477 1.04199C9.9759 1.04199 10.4028 1.19 10.7397 1.45977L17.273 6.76425C17.4804 6.9303 17.6471 7.13722 17.7614 7.37057C17.8757 7.60393 17.9348 7.85809 17.9348 8.11534V16.0734C17.9348 16.5424 17.7381 16.9922 17.388 17.3239C17.038 17.6555 16.5632 17.8418 16.0681 17.8418H3.00143C2.50636 17.8418 2.03157 17.6555 1.6815 17.3239C1.33143 16.9922 1.13477 16.5424 1.13477 16.0734V8.11534Z" stroke={(pathname == '/dashboard/inicio') ? '#0B3C70' : '#B6BEC9 '} strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Inicio
                    </Link>
                    <Link href={'/dashboard/perfil/fichajes'} className={`${(pathname == '/dashboard/perfil/fichajes') ? styles.itemActive : styles.item}`}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
                            <path d="M12.5117 12.7109C14.475 12.7109 16.2742 13.1299 17.6387 13.8271L17.9053 13.9707C19.2903 14.751 20.21 15.8635 20.21 17.1436V17.2383L20.208 17.6553C20.1926 18.556 20.0844 19.4434 19.3682 20.1367L19.1914 20.293C18.7474 20.6538 18.1256 20.9432 17.2607 21.1543L16.874 21.2402C15.8023 21.4574 14.3861 21.5752 12.5117 21.5752C10.872 21.5752 9.58258 21.4854 8.56934 21.3174L8.15137 21.2402H8.15039C7.21459 21.0515 6.53074 20.7834 6.03516 20.4434L5.83398 20.293C4.83312 19.4774 4.8135 18.3467 4.81445 17.2383V17.1436C4.81445 15.9434 5.62308 14.8909 6.86621 14.1211L7.12012 13.9707C8.51137 13.1883 10.4186 12.711 12.5117 12.7109ZM12.5127 13.1777C10.6096 13.1778 8.88668 13.5844 7.59961 14.2422L7.34863 14.3779C6.03006 15.1194 5.28027 16.1074 5.28027 17.1436C5.28028 18.2467 5.29034 19.1342 5.98047 19.8018L6.12793 19.9316C6.50037 20.2346 7.05235 20.5003 7.87402 20.7012L8.24316 20.7832C9.27081 20.9914 10.6541 21.1084 12.5117 21.1084C14.1375 21.1084 15.3998 21.0194 16.3789 20.8574L16.7812 20.7832C17.8097 20.5755 18.4695 20.2789 18.8955 19.9316C19.732 19.2517 19.7441 18.32 19.7441 17.1436C19.7441 16.1075 18.9956 15.1186 17.6758 14.377H17.6748C16.3651 13.6408 14.5404 13.1777 12.5127 13.1777ZM12.5117 3.30859C13.4976 3.30859 14.4464 3.67538 15.1738 4.33398L15.3164 4.46973C16.0601 5.2134 16.4775 6.2227 16.4775 7.27441C16.4774 8.32595 16.06 9.33456 15.3164 10.0781C14.5727 10.8218 13.5634 11.2393 12.5117 11.2393C11.4602 11.2391 10.4516 10.8217 9.70801 10.0781C8.96445 9.33456 8.547 8.32596 8.54688 7.27441C8.54688 6.28848 8.91365 5.33972 9.57227 4.6123L9.70801 4.46973C10.4516 3.72618 11.4602 3.30872 12.5117 3.30859ZM12.5117 3.77441C11.642 3.77453 10.8058 4.0988 10.1641 4.67969L10.0381 4.7998C9.38186 5.45603 9.0127 6.34637 9.0127 7.27441C9.01281 8.14412 9.33707 8.98034 9.91797 9.62207L10.0381 9.74805C10.6942 10.4042 11.5838 10.7733 12.5117 10.7734C13.3816 10.7734 14.2185 10.4492 14.8604 9.86816L14.9863 9.74805C15.6424 9.09193 16.0116 8.20228 16.0117 7.27441C16.0117 6.40454 15.6875 5.56763 15.1064 4.92578L14.9863 4.7998C14.3301 4.14358 13.4398 3.77441 12.5117 3.77441Z" fill={(pathname == '/dashboard/perfil/fichajes' || pathname == '/dashboard/perfil/vacaciones' || pathname == '/dashboard/perfil/solicitudes') || pathname == '/dashboard/editar_perfil' || pathname.startsWith('/dashboard/editar_perfil/') ? '#0B3C70' : '#B6BEC9 '} stroke={(pathname == '/dashboard/perfil/fichajes' || pathname == '/dashboard/perfil/vacaciones' || pathname == '/dashboard/perfil/solicitudes') || pathname == '/dashboard/editar_perfil' || pathname.startsWith('/dashboard/editar_perfil/') ? '#0B3C70' : '#B6BEC9 '} strokeWidth="0.933333" />
                        </svg>
                        Perfil
                    </Link>
                    <Link href={'/dashboard/archivos'} className={`${(pathname == '/dashboard/archivos') ? styles.itemActive : styles.item}`}>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
                            <path d="M21.7383 10.3248V18.0228C21.7383 18.8405 21.4135 19.6247 20.8353 20.2028C20.2571 20.781 19.4729 21.1058 18.6553 21.1058H6.32128C5.50362 21.1058 4.71945 20.781 4.14127 20.2028C3.5631 19.6247 3.23828 18.8405 3.23828 18.0228V6.86083C3.23828 6.04317 3.5631 5.259 4.14127 4.68082C4.71945 4.10265 5.50362 3.77783 6.32128 3.77783H9.40528C9.91407 3.77723 10.4151 3.90268 10.8635 4.14297C11.312 4.38326 11.694 4.7309 11.9753 5.15483L12.8483 6.48083C13.0085 6.71784 13.2243 6.91195 13.4769 7.04619C13.7296 7.18043 14.0112 7.25069 14.2973 7.25083H18.6553C19.4713 7.25109 20.254 7.57476 20.8318 8.15093C21.4097 8.7271 21.7356 9.50881 21.7383 10.3248Z" stroke={(pathname == '/dashboard/archivos') ? '#0B3C70' : '#B6BEC9 '} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Archivos
                    </Link>
                </>
            }

            {
                (is_admin) &&
                <Link href={'/dashboard/recursos/gestion'} className={`${(pathname == '/dashboard/recursos/gestion') ? styles.itemActive : styles.item}`}>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
                        <path d="M12.7648 20.842V10.342M19.0648 20.842V4.04199M6.46484 20.842V16.642" stroke={(pathname == '/dashboard/recursos/gestion' || pathname == '/dashboard/recursos/informes' || pathname.startsWith('/dashboard/recursos/informes/') || pathname == '/dashboard/recursos/incidencias' || pathname == '/dashboard/recursos/comentarios' || pathname.startsWith('/dashboard/editar_perfil/') || pathname == '/dashboard/addUser' || pathname == '/dashboard/editar_perfil') ? '#0B3C70' : '#B6BEC9 '} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Informes
                </Link>
            }


        </>
    );
}