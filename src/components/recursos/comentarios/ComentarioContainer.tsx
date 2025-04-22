import styles from './comentarioContainer.module.css';

export default function ComentarioContainer() {
    return (
        <div className={styles.container}>
            <header className={styles.title}>
                <h2> Nombre </h2>
            </header>
            <div className={styles.item}>
                <h3>fecha</h3>
                <h3>comentario</h3>
            </div>
        </div>
    );
}