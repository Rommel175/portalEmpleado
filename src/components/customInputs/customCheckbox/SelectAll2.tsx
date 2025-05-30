'use client'
import styles from './selectAll.module.css';

type Evento = {
  id: number;
  fichaje_id: number;
  evento: string;
  modificado: boolean;
  dateOriginal: Date;
  dateModificada: Date,
  dateCalculos: Date,
  localizacion: string;
};

export default function SelectAll2({ checkedState, setCheckedState, eventos }: { checkedState: { [key: string]: boolean }, setCheckedState: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>, eventos: Evento[] }) {
    function handleSelectAll() {
        const allChecked = eventos.every(evento => checkedState[evento.id]);

        const newPartialState = Object.fromEntries(
            eventos.map(evento => [evento.id, !allChecked])
        );

        setCheckedState(prevState => ({
            ...prevState,
            ...newPartialState
        }));
    }

    return (
        <label className={styles.checkboxContainer}>
            <input
                type="checkbox"
                checked
                onChange={handleSelectAll}
                className={styles.hiddenCheckbox}
            />
            <span className={`${styles.customBox} ${styles.checked}`}>
                <span className={styles.checkmark}>✓</span>
            </span>
        </label>
    );
}