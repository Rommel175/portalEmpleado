import { User } from '@supabase/supabase-js';
import styles from './navbar.module.css';
import NavbarItem from './NavbarItem';

export default function Navbar( {image}: {image: string} ) {
    return (
        <nav className={styles.nav}>
            <div className={styles.navContainer}>
                <NavbarItem image={image}/> 
            </div>
        </nav>
    );
}