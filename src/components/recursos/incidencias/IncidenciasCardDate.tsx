import dayjs from 'dayjs';
import styles from './incidenciasCardDate.module.css'
dayjs.locale('es');

export default function IncidenciasCardDate({ evento, fecha_original, fecha_solicitada }: { evento: string, fecha_original: Date, fecha_solicitada: Date }) {

    function formatDate(date: Date) {
        const date2 = dayjs(date)
        const day = date2.format('DD');
        const month = date2.format('MMMM');
        const year = date2.format('YYYY');
        const hour = date2.format('HH:mm')

        return `${day} de ${month} de ${year}, ${hour}`
    }


    return (
        <div className={styles.date}>

            <div className={styles.dateItem}>
                <h4>Fecha actual</h4>
                <div className={styles.dateItemContent}>
                    <h3>{evento}</h3>
                    <div>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.00038 13.5386C11.0592 13.5386 13.5388 11.0589 13.5388 8.00013C13.5388 4.94132 11.0592 2.46167 8.00038 2.46167C4.94157 2.46167 2.46191 4.94132 2.46191 8.00013C2.46191 11.0589 4.94157 13.5386 8.00038 13.5386Z" stroke="#7B8794" strokeWidth="0.92694" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.38501 5.53809V8.61501H10.4619" stroke="#7B8794" strokeWidth="0.92694" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p>{formatDate(fecha_original)}</p>
                    </div>
                </div>
            </div>

            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.375 9H14.625M14.625 9L10.4062 4.5M14.625 9L10.4062 13.5" stroke="#C0C0C0" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className={styles.dateItem}>
                <h4>Petición</h4>
                <div className={styles.dateItemContent}>
                    <h3>{evento}</h3>
                    <div>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.00038 13.5386C11.0592 13.5386 13.5388 11.0589 13.5388 8.00013C13.5388 4.94132 11.0592 2.46167 8.00038 2.46167C4.94157 2.46167 2.46191 4.94132 2.46191 8.00013C2.46191 11.0589 4.94157 13.5386 8.00038 13.5386Z" stroke="#7B8794" strokeWidth="0.92694" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.38501 5.53809V8.61501H10.4619" stroke="#7B8794" strokeWidth="0.92694" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p>{formatDate(fecha_solicitada)}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}