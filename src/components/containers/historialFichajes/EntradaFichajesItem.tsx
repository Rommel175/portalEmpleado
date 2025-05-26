'use client'

import dayjs from 'dayjs';
import ButtonModificar from './ButtonModificar';
import styles from './entradaFichajesItem.module.css'
import SelectOne from '@/components/customInputs/customCheckbox/SelectOne';

type Prop = {
    action: string,
    hour: Date,
    date: string,
    localizacion: string,
    id: number,
    checkedStateFichajes: boolean,
    setCheckedStateFichajes: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
    isSelected: boolean
}

export default function EntradaFichajesItem({ action, hour, date, localizacion, id, checkedStateFichajes, setCheckedStateFichajes, isSelected }: Prop) {

    return (
        <div className={styles.item}>
            {
                isSelected &&
                <SelectOne checkedState={checkedStateFichajes} setCheckedState={setCheckedStateFichajes} id={String(id)} />
            }
            <h3>{action}</h3>
            <h3>{dayjs(hour).format('HH:mm:ss')}</h3>
            <h3>{localizacion}</h3>

            <ButtonModificar hour={hour} date={date} id={id} action={action} />

        </div>
    );
}