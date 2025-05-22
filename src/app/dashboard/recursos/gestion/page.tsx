'use client';

import { useEffect, useState } from 'react';;
import styles from './gestion.module.css';
import EquipoAdmin from '@/components/recursos/gestion/Equipo';
import { Equipo } from '@/types/Types';
import Link from 'next/link';

export default function GestionPage() {
    const [equipo, setEquipo] = useState<Equipo[]>([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/gestion', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                console.error('Error en la respuesta:', res.status);
                return;
            }

            const result = await res.json();

            if (result.success) {
                setEquipo(result.dataEquipo)
            }
        }

        fetchData();

    }, []);

    function handleClose() {
        setShow(false);
    }




    return (
        <>
            {
                show &&
                <div className={styles.overlay}>
                    <div className={styles.modalContainer}>
                        <svg onClick={handleClose} className={styles.svgModal} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.1811 10.8737L14.3294 15.0219C14.4677 15.1555 14.6529 15.2294 14.8452 15.2278C15.0374 15.2261 15.2214 15.149 15.3573 15.013C15.4933 14.877 15.5704 14.6931 15.5721 14.5009C15.5737 14.3086 15.4998 14.1234 15.3663 13.9851L11.218 9.83679L15.3663 5.68853C15.4998 5.55023 15.5737 5.36499 15.5721 5.17273C15.5704 4.98046 15.4933 4.79654 15.3573 4.66058C15.2214 4.52462 15.0374 4.4475 14.8452 4.44583C14.6529 4.44416 14.4677 4.51807 14.3294 4.65165L10.1811 8.79991L6.03284 4.65165C5.89392 4.52137 5.70976 4.45026 5.51934 4.45335C5.32891 4.45644 5.14716 4.5335 5.01254 4.66821C4.87792 4.80293 4.80099 4.98474 4.79803 5.17516C4.79508 5.36559 4.86632 5.5497 4.99669 5.68853L9.14422 9.83679L4.99596 13.9851C4.92592 14.0527 4.87006 14.1336 4.83163 14.2231C4.7932 14.3125 4.77297 14.4088 4.77212 14.5061C4.77128 14.6035 4.78983 14.7001 4.8267 14.7902C4.86357 14.8803 4.91802 14.9622 4.98687 15.031C5.05572 15.0999 5.1376 15.1543 5.22772 15.1912C5.31784 15.2281 5.4144 15.2466 5.51176 15.2458C5.60913 15.2449 5.70535 15.2247 5.79482 15.1863C5.88428 15.1478 5.9652 15.092 6.03284 15.0219L10.1811 10.8737Z" fill="#333333" />
                        </svg>
                        <div className={styles.contentModal}>
                            <div className={styles.text}>
                                <h3>Añadir nuevo usuario a la plataforma</h3>
                                <p>Desde aquí puedes crear cuentas para que otros usuarios accedan a la plataforma. Recuerda que el acceso está limitado únicamente a cuentas corporativas de Google. asociadas a tu empresa</p>
                            </div>
                            <Link href={'/dashboard/addUser'} className={styles.addUser2}>Añadir usuario</Link>
                        </div>
                    </div>
                </div>
            }

            <div className={styles.container}>
                <div className={styles.option}>
                    <button className={styles.addUser} onClick={() => { setShow(true) }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10 2.7085C10.1658 2.7085 10.3248 2.77434 10.442 2.89155C10.5592 3.00876 10.625 3.16774 10.625 3.3335V9.37516H16.6667C16.8325 9.37516 16.9914 9.44101 17.1087 9.55822C17.2259 9.67543 17.2917 9.8344 17.2917 10.0002C17.2917 10.1659 17.2259 10.3249 17.1087 10.4421C16.9914 10.5593 16.8325 10.6252 16.6667 10.6252H10.625V16.6668C10.625 16.8326 10.5592 16.9916 10.442 17.1088C10.3248 17.226 10.1658 17.2918 10 17.2918C9.83428 17.2918 9.67531 17.226 9.5581 17.1088C9.44089 16.9916 9.37504 16.8326 9.37504 16.6668V10.6252H3.33337C3.16761 10.6252 3.00864 10.5593 2.89143 10.4421C2.77422 10.3249 2.70837 10.1659 2.70837 10.0002C2.70837 9.8344 2.77422 9.67543 2.89143 9.55822C3.00864 9.44101 3.16761 9.37516 3.33337 9.37516H9.37504V3.3335C9.37504 3.16774 9.44089 3.00876 9.5581 2.89155C9.67531 2.77434 9.83428 2.7085 10 2.7085Z" fill="#285FF5" />
                        </svg>
                        Añadir Usuario
                    </button>
                </div>
                <EquipoAdmin equipo={equipo} />
            </div>
        </>
    );
}
