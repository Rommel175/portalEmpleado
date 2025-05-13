'use client';

import { useEffect, useState } from 'react';;
import styles from './gestion.module.css';
import EquipoAdmin from '@/components/recursos/gestion/Equipo';
import { Equipo } from '@/types/Types';

export default function GestionPage() {
    const [equipo, setEquipo] = useState<Equipo[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/equipo', {
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

    }, [])


    return (
        <div className={styles.container}>
            <div className={styles.option}>
                <button className={styles.addUser}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10 2.7085C10.1658 2.7085 10.3248 2.77434 10.442 2.89155C10.5592 3.00876 10.625 3.16774 10.625 3.3335V9.37516H16.6667C16.8325 9.37516 16.9914 9.44101 17.1087 9.55822C17.2259 9.67543 17.2917 9.8344 17.2917 10.0002C17.2917 10.1659 17.2259 10.3249 17.1087 10.4421C16.9914 10.5593 16.8325 10.6252 16.6667 10.6252H10.625V16.6668C10.625 16.8326 10.5592 16.9916 10.442 17.1088C10.3248 17.226 10.1658 17.2918 10 17.2918C9.83428 17.2918 9.67531 17.226 9.5581 17.1088C9.44089 16.9916 9.37504 16.8326 9.37504 16.6668V10.6252H3.33337C3.16761 10.6252 3.00864 10.5593 2.89143 10.4421C2.77422 10.3249 2.70837 10.1659 2.70837 10.0002C2.70837 9.8344 2.77422 9.67543 2.89143 9.55822C3.00864 9.44101 3.16761 9.37516 3.33337 9.37516H9.37504V3.3335C9.37504 3.16774 9.44089 3.00876 9.5581 2.89155C9.67531 2.77434 9.83428 2.7085 10 2.7085Z" fill="#285FF5" />
                    </svg>
                    Añadir Usuario
                </button>
            </div>
            <EquipoAdmin equipo={equipo} />
        </div>
    );
}
