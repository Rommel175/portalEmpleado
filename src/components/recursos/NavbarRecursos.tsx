'use client'

import Link from 'next/link';
import styles from './navbarRecursos.module.css';
import { usePathname } from "next/navigation";


export default function NavbarRecursos() {
    const path = usePathname();
    return (
        <div className={styles.navbar}>
            <Link href={'/dashboard/recursos/incidencias'} className={`${(path == '/dashboard/recursos/incidencias') ? styles.active : ''}`}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.68529 18.049H17.3145C17.5196 18.049 17.7212 17.9957 17.8996 17.8945C18.0779 17.7932 18.227 17.6474 18.3322 17.4713C18.4373 17.2952 18.495 17.0948 18.4996 16.8898C18.5041 16.6847 18.4554 16.4819 18.3582 16.3013L12.044 4.57474C11.596 3.74332 10.4037 3.74332 9.95578 4.57474L3.64157 16.3013C3.54433 16.4819 3.49561 16.6847 3.50017 16.8898C3.50473 17.0948 3.56241 17.2952 3.66758 17.4713C3.77275 17.6474 3.92181 17.7932 4.10019 17.8945C4.27858 17.9957 4.48018 18.049 4.68529 18.049Z" stroke={(path == '/dashboard/recursos/incidencias') ? "#0B3C70" : '#B3B7BA'} strokeWidth="1.18563" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10.7535 8.39557L11.0001 13.6378L11.2463 8.39772C11.2478 8.36422 11.2425 8.33076 11.2307 8.29939C11.2188 8.26802 11.2007 8.2394 11.1774 8.21527C11.1541 8.19114 11.1262 8.17201 11.0952 8.15905C11.0643 8.14609 11.0311 8.13958 10.9975 8.1399C10.9646 8.14023 10.932 8.14715 10.9018 8.16026C10.8716 8.17336 10.8443 8.1924 10.8215 8.21623C10.7988 8.24006 10.781 8.26821 10.7693 8.29901C10.7577 8.32981 10.7523 8.36264 10.7535 8.39557Z" stroke={(path == '/dashboard/recursos/incidencias') ? "#0B3C70" : '#B3B7BA'} strokeWidth="1.375" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 17.0693C10.83 17.0693 10.6639 17.0189 10.5226 16.9245C10.3812 16.8301 10.2711 16.6959 10.206 16.5388C10.141 16.3818 10.124 16.209 10.1571 16.0423C10.1903 15.8756 10.2721 15.7225 10.3923 15.6023C10.5125 15.4821 10.6656 15.4003 10.8323 15.3671C10.999 15.3339 11.1718 15.351 11.3289 15.416C11.4859 15.481 11.6201 15.5912 11.7145 15.7325C11.809 15.8738 11.8594 16.04 11.8594 16.21C11.8594 16.4379 11.7688 16.6565 11.6077 16.8176C11.4465 16.9788 11.2279 17.0693 11 17.0693Z" fill={(path == '/dashboard/recursos/incidencias') ? "#0B3C70" : '#B3B7BA'} />
                </svg>
                Incidencias
            </Link>
            <Link href={'/dashboard/recursos/reportes'} className={`${(path == '/dashboard/recursos/reportes') ? styles.active : ''}`}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.875 9.9706V17.8062C17.875 18.3184 17.6715 18.8097 17.3094 19.1718C16.9472 19.534 16.4559 19.7375 15.9438 19.7375H6.93125C6.41905 19.7375 5.92783 19.534 5.56565 19.1718C5.20347 18.8097 5 18.3184 5 17.8062V4.93125C5 4.41905 5.20347 3.92783 5.56565 3.56565C5.92783 3.20347 6.41905 3 6.93125 3H10.9044C11.2457 3.00005 11.5731 3.13565 11.8145 3.377L17.498 9.0605C17.7393 9.3019 17.8749 9.62926 17.875 9.9706Z" stroke={(path == '/dashboard/recursos/reportes') ? "#0B3C70" : '#B3B7BA'} strokeWidth="1.2875" strokeLinejoin="round" />
                    <path d="M11.4375 3.32178V8.1499C11.4375 8.49137 11.5731 8.81885 11.8146 9.0603C12.0561 9.30176 12.3835 9.4374 12.725 9.4374H17.5531" stroke={(path == '/dashboard/recursos/reportes') ? "#0B3C70" : '#B3B7BA'} strokeWidth="1.2875" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Reportes
            </Link>
        </div>
    );
}