'use client'
import styles from './selectOne.module.css';

export default function SelectOne({ checkedState, setCheckedState, id }: { checkedState: boolean, setCheckedState: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>, id: string }) {
    function handleCheckboxChange(id: string) {
        setCheckedState((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    }

    return (
        <label className={styles.checkboxContainer}>
            <input
                type="checkbox"
                checked={!!checkedState}
                onChange={() => {handleCheckboxChange(id)}}
                className={styles.hiddenCheckbox}
            />
            <span className={`${styles.customBox} ${checkedState ? styles.checked : ""}`}>
                {checkedState && <span className={styles.checkmark}>✓</span>}
            </span>
        </label>
    );
}