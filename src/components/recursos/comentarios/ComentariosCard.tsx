import styles from './comentariosCard.module.css'
import ComentariosCardDate from './ComentariosCardDate';
import ComentariosCardHeader from './ComentariosCardHeader';

type FichajeComentario = {
    fecha: Date,
    comentario: string
};

export default function ComentariosCard( {nombre, apellido, email, image, fichajes} : { nombre: string, apellido: string, email: string, image: string, fichajes: FichajeComentario } ) {
  return (
    <div className={styles.card}>
      <ComentariosCardHeader nombre={nombre} apellido={apellido} email={email} image={image} date={fichajes.fecha} />
      <ComentariosCardDate date={fichajes.fecha} comentario={fichajes.comentario} />  
    </div>
  );
}