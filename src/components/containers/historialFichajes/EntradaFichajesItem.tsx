import ButtonModificar from './ButtonModificar';
import styles from './entradaFichajesItem.module.css'

type Prop = {
    action: 'Entrada' | 'Pausa' | 'Salida',
    hour: string,
    date: string
}

export default function EntradaFichajesItem({ action, hour, date }: Prop) {
    return (
        <div className={styles.item}>
            <h3>{action}</h3>
            <h3>{hour}h</h3>
            <h3>Oficina</h3>

            <ButtonModificar hour={hour} date={date} />

        </div>
    );
}