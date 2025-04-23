import styles from './comentarioContainer.module.css';
import ComentarioItem from './ComentarioItem';

type FichajeComentario = {
    fecha: Date;
    comentario: string;
};

export default function ComentarioContainer( {nombre, fichajes} : {nombre: string, fichajes: FichajeComentario[] } ) {

    return (
        <div className={styles.container}>
            <header className={styles.title}>
                <h2> {nombre} </h2>
            </header>

            {
                fichajes.map((item, index) => {
                    return <ComentarioItem key={index} fecha={item.fecha} comentario={item.comentario}/>
                })
            }
        </div>
    );
}