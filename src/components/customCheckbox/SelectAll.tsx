'use client'
import styles from './selectAll.module.css';

export default function SelectAll({ checkedState, setCheckedState }: { checkedState: { [key: string]: boolean }, setCheckedState: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>> }) {
    function handleSelectAll() {
        const allChecked = Object.values(checkedState).every(Boolean);
        const newState = Object.fromEntries(
            Object.keys(checkedState).map(id => [id, !allChecked])
        );
        setCheckedState(newState);
    };

    return (
        <label className={styles.checkboxContainer}>
            <input
                type="checkbox"
                checked
                onChange={handleSelectAll}
                className={styles.hiddenCheckbox}
            />
            <span className={ `${styles.customBox} ${styles.checked}`}>
                <span className={styles.checkmark}>✓</span>
            </span>
        </label>
    );
}