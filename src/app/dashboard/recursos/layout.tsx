import SidebarRecursos from '@/components/recursos/SidebarRecursos';
import styles from './layput.module.css'

export default function RecursosLayout({ children }: { children: React.ReactNode; }) {
    return (
        <div className={styles.wraper}>
            <SidebarRecursos />
            { children }
        </div>
    );
}