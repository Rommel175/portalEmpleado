import styles from './loading.module.css'

export default function Loading() {
    return (
        <div className={styles.arrow}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}