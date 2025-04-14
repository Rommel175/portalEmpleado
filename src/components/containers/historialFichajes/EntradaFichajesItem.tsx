import ButtonModificar from './ButtonModificar';
import styles from './entradaFichajesItem.module.css'

type Prop = {
    action: string,
    hour: string,
    date: string,
    localizacion: string
}

export default function EntradaFichajesItem({ action, hour, date, localizacion }: Prop) {
    return (
        <div className={styles.item}>
            <h3>{action}</h3>
            <h3>{hour}</h3>
            <h3>{localizacion}</h3>

            <ButtonModificar hour={hour} date={date} />

        </div>
    );
}