import styles from './comentariosCardDate.module.css';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default function ComentariosCardDate({ date, comentario }: { date: Date, comentario: string }) {

    dayjs.locale('es');

    function formatDate(date: Date) {
        const date2 = dayjs(date)
        const day = date2.format('DD');
        const month = date2.format('MMMM');
        const year = date2.format('YYYY');
        const hour = date2.format('HH:mm')

        return `${day} de ${month} de ${year}, ${hour}`
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.containerDate}>
                    <h2>Fecha actual</h2>
                    <div className={styles.content}>
                        <p>Entrada</p>
                        <div className={styles.date}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.00038 13.5386C11.0592 13.5386 13.5388 11.0589 13.5388 8.00013C13.5388 4.94132 11.0592 2.46167 8.00038 2.46167C4.94157 2.46167 2.46191 4.94132 2.46191 8.00013C2.46191 11.0589 4.94157 13.5386 8.00038 13.5386Z" stroke="#7B8794" strokeWidth="0.92694" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.38501 5.53809V8.61501H10.4619" stroke="#7B8794" strokeWidth="0.92694" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p>{formatDate(date)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.comentario}>
                <p>{comentario}</p>
            </div>
        </>

    );
}