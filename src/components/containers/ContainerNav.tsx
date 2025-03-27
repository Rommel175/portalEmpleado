import styles from './containerNav.module.css'

type Props = {
    name: string,
    svg: React.ReactNode;
}

export default function ContainerNav( {name, svg}: Props ) {
    return (
        <nav className={styles.nav}>

            <div className={styles.navTitle}>
                {svg}
                <h1>{ name }</h1>
            </div>
        </nav>
    );
}