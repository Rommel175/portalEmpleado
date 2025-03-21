import styles from './navInicio.module.css';
import NavInicioItem from './NavItem';

export default function NavHomePage() {
    return (
        <nav className={styles.nav}>
            <div className={styles.navContainer}>
                <NavInicioItem />
            </div>
        </nav>
    );
}