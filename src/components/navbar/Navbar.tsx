import { User } from '@supabase/supabase-js';
import styles from './navbar.module.css';
import NavbarItem from './NavbarItem';



export default function Navbar( {user} : {user: User} ) {
    return (
        <nav className={styles.nav}>
            <div className={styles.navContainer}>
                <NavbarItem user={user}/> 
            </div>
        </nav>
    );
}