import { User } from '@supabase/supabase-js';
import styles from './navInicio.module.css';
import NavInicioItem from './NavItem';

export default function NavHomePage( {user} : {user: User} ) {
    return (
        <nav className={styles.nav}>
            <div className={styles.navContainer}>
                <NavInicioItem user={user}/>
            </div>
        </nav>
    );
}