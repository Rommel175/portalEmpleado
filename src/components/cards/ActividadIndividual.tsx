'use client'

import { useEffect } from 'react';
import styles from './actividadIndividual.module.css';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

type Props = {
    totalHoras: number;
    setTotalHorasTrabajadas: React.Dispatch<React.SetStateAction<string>>
    startDate: Date | null,
    setStartDate: React.Dispatch<React.SetStateAction<Date | null>>,
    endDate: Date | null,
    setEndDate: React.Dispatch<React.SetStateAction<Date | null>>,
    option: string,
    setOption: React.Dispatch<React.SetStateAction<string>>,
    localizacion: string,
    setLocalizacion: React.Dispatch<React.SetStateAction<string>>
    totalHorasTrabajadas: string,
    id: string,
};

dayjs.extend(duration);


export default function ActividadCardIndividual({ totalHoras, setTotalHorasTrabajadas, totalHorasTrabajadas, startDate, setStartDate, endDate, setEndDate, option, localizacion, id }: Props) {

    useEffect(() => {

        let start = startDate;
        let end = endDate;

        if (!startDate || !endDate) {
            const now = dayjs();

            start = now.day(1).startOf('day').toDate();
            end = now.day(1).add(5, 'day').endOf('day').toDate();

            setStartDate(start);
            setEndDate(end);
        }

        const fetchData = async () => {

            const params = new URLSearchParams({
                option: option,
                startDate: start ? start.toISOString() : '',
                endDate: end ? end.toISOString() : '',
                localizacion: localizacion,
                profileId: id
            });


            const res = await fetch(`/api/actividadCard?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                console.error('Error en la respuesta:', res.status);
                return;
            }

            const result = await res.json();

            if (result.success) {
                setTotalHorasTrabajadas(result.totalHoras)
            }
        }

        fetchData();
    }, [option])

    const [horas, minutos] = totalHorasTrabajadas.split(':').map(Number);
    const segundosTrabajados = dayjs.duration({ hours: horas, minutes: minutos }).asSeconds();
    const totalHorasSegundos = dayjs.duration({hours: totalHoras}).asSeconds();
    const porcentaje = Math.min((segundosTrabajados / totalHorasSegundos) * 100, 100);

    

    return (
        <div className={styles.container} style={{ display: 'none' }}>
            <h3>Actividad</h3>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3>{totalHorasTrabajadas} h</h3>
                    <div className={styles.horizontalBarContainer}>
                        <div className={styles.horizontalBar} style={{ width: `${porcentaje}%` }} />
                    </div>
                </div>
                <div className={styles.verticalBarContainer}>
                    <div className={styles.verticalBar} style={{ height: `${porcentaje}%` }} />
                </div>
            </div>
        </div>

    );
}
