'use client'

import Link from 'next/link';
import styles from './navbarPerfil.module.css';
import { usePathname } from 'next/navigation';

export default function NavbarPerfil() {
    const path = usePathname();
    return (
        <div className={styles.navbar}>
            <Link href={'/dashboard/perfil/fichajes'} className={`${(path == '/dashboard/perfil/fichajes') ? styles.active : ''}`}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.06025 15.773C7.16459 16.8773 8.6177 17.5645 10.172 17.7175C11.7262 17.8705 13.2855 17.4799 14.5839 16.612C15.8824 15.7442 16.8398 14.453 17.2929 12.9584C17.746 11.4638 17.6669 9.85832 17.0689 8.41556C16.4709 6.97279 15.3911 5.78203 14.0136 5.04618C12.636 4.31034 11.0459 4.07495 9.51424 4.38014C7.98257 4.68532 6.60412 5.5122 5.6138 6.71984C4.62348 7.92749 4.08257 9.44118 4.08325 11.003V12.5" stroke={(path == '/dashboard/perfil/fichajes') ? "#0B3C70" : '#B3B7BA'} strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.5835 11L4.0835 12.5L5.5835 11M10.0835 8V11.75H13.8335" stroke={(path == '/dashboard/perfil/fichajes') ? "#0B3C70" : '#B3B7BA'} strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Historial de Fichajes
            </Link>
            <Link href={'/dashboard/perfil/vacaciones'} className={`${(path == '/dashboard/perfil/vacaciones') ? styles.active : ''}`}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.75 5.16667V3.5M7.25 5.16667V3.5M3.70833 7.66667H18.2917M3.5 9.37C3.5 7.6075 3.5 6.72583 3.86333 6.0525C4.19187 5.45192 4.70166 4.97042 5.32 4.67667C6.03333 4.33333 6.96667 4.33333 8.83333 4.33333H13.1667C15.0333 4.33333 15.9667 4.33333 16.68 4.67667C17.3075 4.97833 17.8167 5.46 18.1367 6.05167C18.5 6.72667 18.5 7.60833 18.5 9.37083V13.4642C18.5 15.2267 18.5 16.1083 18.1367 16.7817C17.8081 17.3822 17.2983 17.8637 16.68 18.1575C15.9667 18.5 15.0333 18.5 13.1667 18.5H8.83333C6.96667 18.5 6.03333 18.5 5.32 18.1567C4.70179 17.8631 4.19201 17.3819 3.86333 16.7817C3.5 16.1067 3.5 15.225 3.5 13.4625V9.37Z" stroke={(path == '/dashboard/perfil/vacaciones') ? "#0B3C70" : '#B3B7BA'} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Vacaciones
            </Link>
            <Link href={'/dashboard/perfil/solicitudes'} className={`${(path == '/dashboard/perfil/solicitudes') ? styles.active : ''}`}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.875 9.50684V17.875C17.875 18.422 17.6577 18.9466 17.2709 19.3334C16.8841 19.7202 16.3595 19.9375 15.8125 19.9375H6.1875C5.64049 19.9375 5.11589 19.7202 4.72909 19.3334C4.3423 18.9466 4.125 18.422 4.125 17.875V4.125C4.125 3.57799 4.3423 3.05339 4.72909 2.66659C5.11589 2.2798 5.64049 2.0625 6.1875 2.0625H10.4307C10.7952 2.06256 11.1448 2.20737 11.4026 2.46512L17.4724 8.53488C17.7301 8.79269 17.8749 9.14229 17.875 9.50684Z" stroke={(path == '/dashboard/perfil/solicitudes') ? "#0B3C70" : '#B3B7BA'} strokeWidth="1.375" strokeLinejoin="round" />
                    <path d="M11 2.40625V7.5625C11 7.92717 11.1449 8.27691 11.4027 8.53477C11.6606 8.79263 12.0103 8.9375 12.375 8.9375H17.5312" stroke={(path == '/dashboard/perfil/solicitudes') ? "#0B3C70" : '#B3B7BA'} strokeWidth="1.375" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Historial de solicitudes
            </Link>
        </div>
    );
}

