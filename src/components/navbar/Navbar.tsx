import styles from './navbar.module.css';
import NavbarItem from './NavbarItem';

export default function Navbar( {image, nombre, apellido, email}: {image: string, nombre: string, apellido: string, email: string} ) {
    return (
        <nav className={styles.nav}>
            <div className={styles.navContainer}>
                <NavbarItem image={image} nombre={nombre} apellido={apellido} email={email}/> 
            </div>
        </nav>
    );
}