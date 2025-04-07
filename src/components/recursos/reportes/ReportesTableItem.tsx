import Link from 'next/link';
import styles from './reportesTableItem.module.css'
import Image from 'next/image';

export default function ReportesTableItem() {
    return (
        <div className={styles.containerItem}>
            <div className={styles.personalInfo}>
                <Image src={'https://lh3.googleusercontent.com/a/ACg8ocLM80DGO-2W6Ou8eM4Pl4BEj6insLI3HZt1ce3XyRk0Rd3cVQ=s96-c'} width={40} height={40} alt='img' />
                <div className={styles.containerInfo}>
                    <div>
                        <h3>Jane Cooper</h3>
                        <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.60176 8.16465L6.41431 5.3521L3.60176 2.53955" stroke="#333333" strokeWidth="0.623087" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h4>jane.cooper@example.com</h4>
                </div>
            </div>

            <p className={styles.horasSemanales}>36:00h</p>

            <Link href={'#'}>
                Ver Usuario
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.3022 8.19119L6.69727 5.13563L3.3022 2.08008" stroke="#285FF5" strokeWidth="0.611111" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    );
}