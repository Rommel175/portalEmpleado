import Link from 'next/link';
import styles from './links.module.css';

export default function Links() {
    return (
        <div className={styles.container}>
            <h3>Links</h3>
            <div className={styles.content}>
                <Link href={'#'}>
                    Calendario vacaciones
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.0031 10.0605L8.5478 16.5157L7.4873 15.4553L13.9418 9H8.25305V7.5H16.5031V15.75H15.0031V10.0605Z" fill="#333333" />
                    </svg>
                </Link>
                <div className={styles.barContainer}>
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.1284 10.2531V17.8498C21.1284 18.6567 20.8079 19.4306 20.2373 20.0011C19.6667 20.5717 18.8929 20.8922 18.086 20.8922H5.91426C5.10736 20.8922 4.3335 20.5717 3.76293 20.0011C3.19237 19.4306 2.87183 18.6567 2.87183 17.8498V6.83467C2.87183 6.02777 3.19237 5.25391 3.76293 4.68335C4.3335 4.11278 5.10736 3.79224 5.91426 3.79224H8.95768C9.45977 3.79164 9.95419 3.91544 10.3968 4.15257C10.8393 4.38969 11.2163 4.73276 11.4939 5.15112L12.3554 6.45967C12.5135 6.69356 12.7265 6.88512 12.9758 7.01759C13.2251 7.15006 13.503 7.2194 13.7853 7.21954H18.086C18.8913 7.2198 19.6636 7.5392 20.2339 8.1078C20.8041 8.67639 21.1258 9.44781 21.1284 10.2531Z" stroke="#0B3C70" strokeWidth="1.48026" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </div>
    );
}