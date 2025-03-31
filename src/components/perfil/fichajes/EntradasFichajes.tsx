import EntradaFichajesItem from './EntradaFichajesItem';
import styles from './entradasFichajes.module.css';

type Prop = {
    date: string
}

export default function EntradasFichajes( {date}: Prop) {
  return (
    <div className={styles.container}>
      <header>
        <h2> { date } </h2>
      </header>

      <EntradaFichajesItem action='Entrada' hour='19:00'/>
      <EntradaFichajesItem action='Pausa' hour='14:30'/>
      <EntradaFichajesItem action='Entrada' hour='16:20'/>
      <EntradaFichajesItem action='Salida' hour='18:00'/>
    </div>
  );
}