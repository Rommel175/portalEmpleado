import styles from './containerHeader.module.css'

type Props = {
    name: string,
    svg?: React.ReactNode;
}

export default function ContainerNav( {name, svg}: Props ) {
    return (
        <header className={styles.header}>
            <div className={styles.headerTitle}>
                {svg}
                <h1>{ name }</h1>
            </div>
        </header>
    );
}