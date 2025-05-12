import Link from 'next/link';
import styles from './reportesTableItem.module.css'
import Image from 'next/image';

export default function ReportesTableItem({ image, nombre, apellido, email, horas_semana, horas_restantes, id, checkedState, setCheckedState }: { image: string, nombre: string, apellido: string, email: string, horas_semana: string, horas_restantes: string, id: string, checkedState: boolean, setCheckedState: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>> }) {

    function handleCheckboxChange(id: string) {
        setCheckedState((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    }


    return (
        <div className={styles.containerItem}>
            <div className={styles.personalInfo}>
                <input type="checkbox" checked={checkedState} onChange={() => { handleCheckboxChange(id) }} style={{ cursor: 'pointer' }} />
                <Image src={image} width={40} height={40} alt='img' />
                <div className={styles.containerInfo}>
                    <div>
                        <h3>{nombre} {apellido}</h3>
                        <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.60176 8.16465L6.41431 5.3521L3.60176 2.53955" stroke="#333333" strokeWidth="0.623087" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h4>{email}</h4>
                </div>
            </div>

            <p className={styles.horasSemanales}>{horas_semana}h</p>

            <p className={styles.horasRestantes}>{horas_restantes}h</p>

            <Link href={`/dashboard/recursos/informes/${id}`}>
                Ver Historial
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.3022 8.19119L6.69727 5.13563L3.3022 2.08008" stroke="#285FF5" strokeWidth="0.611111" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    );
}