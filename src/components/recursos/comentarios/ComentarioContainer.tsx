import styles from './comentarioContainer.module.css';
import ComentarioItem from './ComentarioItem';

type FichajeComentario = {
    fecha: Date;
    comentario: string;
};

export default function ComentarioContainer( {nombre, apellido, fichajes} : {nombre: string, apellido: string, fichajes: FichajeComentario[] } ) {

    return (
        <div className={styles.container}>
            <header className={styles.title}>
                <h2> {nombre} {apellido || ''}</h2>
            </header>

            {
                fichajes.map((item, index) => {
                    return <ComentarioItem key={index} fecha={item.fecha} comentario={item.comentario}/>
                })
            }
        </div>
    );
}