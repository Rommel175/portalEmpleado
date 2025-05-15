import Link from 'next/link';
import styles from './informesTableItem.module.css'
import Image from 'next/image';
import SelectOne from '@/components/customInputs/customCheckbox/SelectOne';

export default function InformesTableItem({ image, nombre, apellido, email, horas_semana, horas_restantes, id, checkedState, setCheckedState, isSelected }: { image: string, nombre: string, apellido: string, email: string, horas_semana: string, horas_restantes: string, id: string, checkedState: boolean, setCheckedState: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>, isSelected: boolean }) {


    return (
        <div className={styles.containerItem}>
            <div className={styles.personalInfo}>
                {
                    (isSelected) &&
                    <SelectOne checkedState={checkedState} setCheckedState={setCheckedState} id={id} />
                }
                <Image src={image} width={40} height={40} alt='img' />
                <div className={styles.containerInfo}>
                    <h3>{nombre} {apellido}</h3>
                    <h4>{email}</h4>
                </div>
            </div>

            <p className={styles.horasSemanales}>{horas_semana}h</p>

            <p className={styles.horasRestantes}>{horas_restantes}h</p>

            <Link href={`/dashboard/recursos/informes/${id}`} style={{ visibility: 'hidden' }}>
                Ver Historial
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.3022 8.19119L6.69727 5.13563L3.3022 2.08008" stroke="#285FF5" strokeWidth="0.611111" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    );
}