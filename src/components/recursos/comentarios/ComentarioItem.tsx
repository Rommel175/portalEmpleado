import styles from './comentarioItem.module.css';

export default function ComentarioItem({ fecha, comentario }: { fecha: Date, comentario: string }) {
    const fechaFormateada = new Date(fecha).toLocaleString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
    return (
        <div className={styles.item}>
            <h3>{fechaFormateada}</h3>
            <h3>{comentario}</h3>
        </div>
    );
}