'use client'

import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from './customDate.module.css';


export default function CustomDate() {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [option, setOption] = useState('Esta semana');
    const [show, setShow] = useState(false);
    const datepickerRef = useRef<HTMLDivElement | null>(null);

    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setDate(today.getDate() - dayOfWeek);

    const mondayLastWeek = new Date(mondayThisWeek);
    mondayLastWeek.setDate(mondayThisWeek.getDate() - 7);
    const sundayLastWeek = new Date(mondayLastWeek);
    sundayLastWeek.setDate(mondayLastWeek.getDate() + 6);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const firstDayOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const lastDayOfLastYear = new Date(today.getFullYear() - 1, 11, 31);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datepickerRef.current && !datepickerRef.current.contains(event.target as Node)) {
                setShow(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, []);

    function handleOptions(option: string) {

        switch (option) {
            case 'today':
                setStartDate(today);
                setEndDate(today);
                setOption('Hoy')
                break;
            case 'yesterday':
                setStartDate(yesterday);
                setEndDate(yesterday);
                setOption('Ayer')
                break;
            case 'this_week':
                setStartDate(mondayThisWeek);
                setEndDate(today);
                setOption('Esta semana')
                break;
            case 'last_week':
                setStartDate(mondayLastWeek);
                setEndDate(sundayLastWeek);
                setOption('Semana pasada')
                break;
            case 'this_month':
                setStartDate(firstDayOfMonth);
                setEndDate(today);
                setOption('Este mes')
                break;
            case 'last_month':
                setStartDate(firstDayOfLastMonth);
                setEndDate(lastDayOfLastMonth);
                setOption('Mes pasado')
                break;
            case 'this_year':
                setStartDate(firstDayOfYear);
                setEndDate(today);
                setOption('Este año')
                break;
            case 'last_year':
                setStartDate(firstDayOfLastYear);
                setEndDate(lastDayOfLastYear);
                setOption('Año pasado')
                break;
        }

        setShow(false);
    }

    return (
        <div className={styles.filtro}>
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_203_16908)">
                    <path d="M12.6875 14.5H1.3125C0.58625 14.5 0 13.9137 0 13.1875V2.6875C0 1.96125 0.58625 1.375 1.3125 1.375H12.6875C13.4137 1.375 14 1.96125 14 2.6875V13.1875C14 13.9137 13.4137 14.5 12.6875 14.5ZM1.3125 2.25C1.0675 2.25 0.875 2.4425 0.875 2.6875V13.1875C0.875 13.4325 1.0675 13.625 1.3125 13.625H12.6875C12.9325 13.625 13.125 13.4325 13.125 13.1875V2.6875C13.125 2.4425 12.9325 2.25 12.6875 2.25H1.3125Z" fill="#7B8794" />
                    <path d="M3.9375 4C3.6925 4 3.5 3.8075 3.5 3.5625V0.9375C3.5 0.6925 3.6925 0.5 3.9375 0.5C4.1825 0.5 4.375 0.6925 4.375 0.9375V3.5625C4.375 3.8075 4.1825 4 3.9375 4ZM10.0625 4C9.8175 4 9.625 3.8075 9.625 3.5625V0.9375C9.625 0.6925 9.8175 0.5 10.0625 0.5C10.3075 0.5 10.5 0.6925 10.5 0.9375V3.5625C10.5 3.8075 10.3075 4 10.0625 4ZM13.5625 5.75H0.4375C0.1925 5.75 0 5.5575 0 5.3125C0 5.0675 0.1925 4.875 0.4375 4.875H13.5625C13.8075 4.875 14 5.0675 14 5.3125C14 5.5575 13.8075 5.75 13.5625 5.75Z" fill="#7B8794" />
                </g>
                <defs>
                    <clipPath id="clip0_203_16908">
                        <rect width="14" height="14" fill="white" transform="translate(0 0.5)" />
                    </clipPath>
                </defs>
            </svg>
            <input type="text" readOnly onClick={() => setShow(true)} placeholder="Fecha" value={option ? option : (startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : '')} />

            {
                show &&
                <div ref={datepickerRef} className={styles.container}>
                    <div className={styles.options}>
                        <button onClick={() => handleOptions('today')}>Hoy</button>
                        <button onClick={() => handleOptions('yesterday')}>Ayer</button>
                        <button onClick={() => handleOptions('this_week')}>Esta semana</button>
                        <button onClick={() => handleOptions('last_week')}>Semana pasada</button>
                        <button onClick={() => handleOptions('this_month')}>Este mes</button>
                        <button onClick={() => handleOptions('last_month')}>Mes pasado</button>
                        <button onClick={() => handleOptions('this_year')}>Este año</button>
                        <button onClick={() => handleOptions('last_year')}>Año pasado</button>
                    </div>

                    <DatePicker
                        selected={startDate}
                        onChange={(dates) => {
                            const [start, end] = dates;
                            setStartDate(start);
                            setEndDate(end);
                            if (start && end) {
                                setOption('');
                                setShow(false)
                                console.log(start, end)
                            }
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        monthsShown={2}
                        inline
                    />

                </div>
            }

        </div>
    );
}
