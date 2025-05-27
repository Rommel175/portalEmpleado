'use client'

import dayjs from 'dayjs';
import ButtonModificar from './ButtonModificar';
import styles from './entradaFichajesItem.module.css'
import SelectOne from '@/components/customInputs/customCheckbox/SelectOne';

type Prop = {
    action: string,
    fechaOriginal: Date,
    fechaModificacion: Date | string;
    dateJornada: string,
    localizacion: string,
    id: number,
    checkedStateFichajes: boolean,
    setCheckedStateFichajes: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
    isSelected: boolean;
    modificado: boolean;
}

export default function EntradaFichajesItem({ action, fechaOriginal, dateJornada, localizacion, id, checkedStateFichajes, setCheckedStateFichajes, isSelected, fechaModificacion, modificado }: Prop) {

    return (
        <div className={styles.item}>
            {
                isSelected &&
                <SelectOne checkedState={checkedStateFichajes} setCheckedState={setCheckedStateFichajes} id={String(id)} />
            }
            <h3 className={styles.dark}>{action}</h3>
            {
                (!modificado) &&
                <h3 className={styles.light}>{dayjs(fechaOriginal).format('HH:mm:ss')}</h3>
            }

            {
                (modificado) &&
                <div className={styles.modificada}>
                    <span>{dayjs(fechaOriginal).format('HH:mm:ss')}</span>
                    <span>→</span>
                    <span>{dayjs(fechaModificacion).format('HH:mm:ss')}</span>
                </div>
            }

            <h3 className={styles.dark}>{localizacion}</h3>

            <ButtonModificar hour={fechaOriginal} date={dateJornada} id={id} action={action} />

        </div>
    );
}