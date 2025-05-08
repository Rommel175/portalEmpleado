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
            <div>
                <button className={styles.addUser}>
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.99996 2.6665C8.13257 2.6665 8.25974 2.71918 8.35351 2.81295C8.44728 2.90672 8.49996 3.0339 8.49996 3.1665V7.99984H13.3333C13.4659 7.99984 13.5931 8.05252 13.6868 8.14628C13.7806 8.24005 13.8333 8.36723 13.8333 8.49984C13.8333 8.63245 13.7806 8.75962 13.6868 8.85339C13.5931 8.94716 13.4659 8.99984 13.3333 8.99984H8.49996V13.8332C8.49996 13.9658 8.44728 14.093 8.35351 14.1867C8.25974 14.2805 8.13257 14.3332 7.99996 14.3332C7.86735 14.3332 7.74017 14.2805 7.64641 14.1867C7.55264 14.093 7.49996 13.9658 7.49996 13.8332V8.99984H2.66663C2.53402 8.99984 2.40684 8.94716 2.31307 8.85339C2.2193 8.75962 2.16663 8.63245 2.16663 8.49984C2.16663 8.36723 2.2193 8.24005 2.31307 8.14628C2.40684 8.05252 2.53402 7.99984 2.66663 7.99984H7.49996V3.1665C7.49996 3.0339 7.55264 2.90672 7.64641 2.81295C7.74017 2.71918 7.86735 2.6665 7.99996 2.6665Z" fill="white" />
                    </svg>
                    Añadir Usuario
                </button>
            </div>
            <EquipoAdmin equipo={equipo} />
        </div>
    );
}
