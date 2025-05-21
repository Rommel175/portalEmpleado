'use client'

import dayjs from 'dayjs';
import ButtonModificar from './ButtonModificar';
import styles from './entradaFichajesItem.module.css'

type Prop = {
    action: string,
    hour: Date,
    date: string,
    localizacion: string,
    id: number
}

export default function EntradaFichajesItem({ action, hour, date, localizacion, id }: Prop) {

    return (
        <div className={styles.item}>
            <h3>{action}</h3>
            <h3>{dayjs(hour).format('HH:mm:ss')}</h3>
            <h3>{localizacion}</h3>

            <ButtonModificar hour={hour} date={date} id={id} action={action} />

        </div>
    );
}