'use client'

import { useEffect, useState } from 'react';
import styles from './actividadSemanal.module.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  weight: ['900','800','800','700', '600', '500', '400', '300', '200', '100'],
  subsets: ['latin']
});

export default function ActividadSemanal() {

    const [minutosEsperados, setMinutosEsperados] = useState(0);
    const [minutosTrabajados, setMinutosTrabajados] = useState(0);
    const [minutosRestantes, setMinutosRestantes] = useState(0);

    useEffect(() => {
        const fetchActividad = async () => {
            const res = await fetch('/api/actividadSemanal');

            const result = await res.json();
            if (result.success) {
                setMinutosEsperados(result.minutosEsperados);
                setMinutosTrabajados(result.minutosTrabajados);
                setMinutosRestantes(result.minutosRestantes);
            }
        };

        fetchActividad();
    }, []);

    function formatTime(tiempoTotal: number) {
        const horas = Math.floor(tiempoTotal / 60);
        const minutos = tiempoTotal % 60;
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')} h`;
    };

    const porcentaje = minutosEsperados
        ? Math.min(100, (minutosTrabajados / minutosEsperados) * 100)
        : 0;


    return (
        <div className={styles.container}>
            <h3>Actividad semanal</h3>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.text}>
                        <div>
                            <h3 className={inter.className}>{formatTime(minutosTrabajados)}</h3>
                            <h4>{formatTime(minutosRestantes)} restantes</h4>
                        </div>

                        <div className={styles.horizontalBarContainer}>
                            <div className={styles.horizontalBar} style={{ width: `${porcentaje}%` }} />
                        </div>

                    </div>
                </div>
                <div className={styles.barContainer}>
                    <svg width="32" height="31" viewBox="0 0 32 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.2495 25.8828V12.5425M24.2537 25.8828V4.53833M8.24536 25.8828V20.5467" stroke="#0B3C70" strokeWidth="3.0492" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                {
                    /*
                    <div className={styles.verticalBarContainer}>
                        <div className={styles.verticalBar} style={{ height: `${porcentaje}%` }} />
                    </div>
                    */
                }

            </div>
        </div>
    );
}