import NavbarRecursos from '@/components/recursos/NavbarRecursos';
import styles from './layput.module.css'

export default function RecursosLayout({ children }: { children: React.ReactNode; }) {
    return (
        <div className={styles.wraper}>
            <NavbarRecursos />
            { children }
        </div>
    );
}