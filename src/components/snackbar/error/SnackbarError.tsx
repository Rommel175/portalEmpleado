import styles from './snackbarError.module.css';

export default function SnackbarError( {setSnackbarError, message}: {setSnackbarError: React.Dispatch<React.SetStateAction<boolean>>, message: string} ) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.error}>
                    <rect width="14" height="14" rx="7" fill="#E53935" />
                    <path d="M4.5 4.5L9.5 9.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9.5 4.5L4.5 9.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {message}
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.close} onClick={() => { setSnackbarError(false) }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M8.14484 8.69894L11.4634 12.0175C11.5741 12.1244 11.7223 12.1835 11.8761 12.1822C12.0299 12.1809 12.177 12.1192 12.2858 12.0104C12.3946 11.9016 12.4563 11.7545 12.4576 11.6007C12.4589 11.4469 12.3998 11.2987 12.293 11.188L8.97434 7.86943L12.293 4.55082C12.3998 4.44018 12.4589 4.292 12.4576 4.13818C12.4563 3.98437 12.3946 3.83723 12.2858 3.72846C12.177 3.6197 12.0299 3.558 11.8761 3.55666C11.7223 3.55533 11.5741 3.61446 11.4634 3.72132L8.14484 7.03993L4.82623 3.72132C4.71509 3.6171 4.56776 3.56021 4.41542 3.56268C4.26308 3.56515 4.11768 3.6268 4.00998 3.73457C3.90229 3.84234 3.84075 3.98779 3.83838 4.14013C3.83601 4.29247 3.89301 4.43976 3.99731 4.55082L7.31533 7.86943L3.99672 11.188C3.94069 11.2422 3.896 11.3069 3.86525 11.3785C3.83451 11.45 3.81833 11.527 3.81765 11.6049C3.81697 11.6828 3.83182 11.76 3.86131 11.8321C3.89081 11.9042 3.93437 11.9697 3.98945 12.0248C4.04453 12.0799 4.11003 12.1235 4.18213 12.153C4.25422 12.1825 4.33147 12.1973 4.40936 12.1966C4.48726 12.1959 4.56423 12.1798 4.63581 12.149C4.70738 12.1183 4.77211 12.0736 4.82623 12.0175L8.14484 8.69894Z" fill="#333333" />
            </svg>
        </div>
    );
}