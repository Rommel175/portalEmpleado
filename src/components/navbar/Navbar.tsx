import styles from './navbar.module.css';
import NavbarItem from './NavbarItem';

export default function Navbar( {image, title}: {image: string, title: string} ) {
    return (
        <nav className={styles.nav}>
            <div className={styles.navContainer}>
                <h1>{title}</h1>
                <NavbarItem image={image}/> 
            </div>
        </nav>
    );
}