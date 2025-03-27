import styles from './containerHeader.module.css'

type Prop = {
    title: string
}

export default function ContainerHeader( {title}: Prop ) {
    return (
        <div className={styles.header}>
            <header className={styles.title}>
                <h1>{ title }</h1>
            </header>
        </div>
    );
}