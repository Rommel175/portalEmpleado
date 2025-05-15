'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './inputRegistro.module.css';
import SelectOne from '../customCheckbox/SelectOne';
type Props = {
    checkedStateRegistro: { [key: string]: boolean };
    setCheckedStateRegistro: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
    totalRegistros: number
}

export default function InputRegistro({ checkedStateRegistro, setCheckedStateRegistro, totalRegistros }: Props) {
    const [show, setShow] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShow(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    function handleDropdown() {
        setShow(prevState => !prevState);
    }

    function handleLabelClick(e: React.MouseEvent) {
        e.stopPropagation();
    }

    return (
        <div className={styles.filtro} onClick={handleDropdown} ref={dropdownRef}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_92_4640)">
                    <path d="M12.6873 14H1.31226C0.586006 14 -0.000244141 13.4137 -0.000244141 12.6875V2.1875C-0.000244141 1.46125 0.586006 0.875 1.31226 0.875H12.6873C13.4135 0.875 13.9998 1.46125 13.9998 2.1875V12.6875C13.9998 13.4137 13.4135 14 12.6873 14ZM1.31226 1.75C1.06726 1.75 0.874756 1.9425 0.874756 2.1875V12.6875C0.874756 12.9325 1.06726 13.125 1.31226 13.125H12.6873C12.9323 13.125 13.1248 12.9325 13.1248 12.6875V2.1875C13.1248 1.9425 12.9323 1.75 12.6873 1.75H1.31226Z" fill="#7B8794" />
                    <path d="M3.93726 3.5C3.69226 3.5 3.49976 3.3075 3.49976 3.0625V0.4375C3.49976 0.1925 3.69226 0 3.93726 0C4.18226 0 4.37476 0.1925 4.37476 0.4375V3.0625C4.37476 3.3075 4.18226 3.5 3.93726 3.5ZM10.0623 3.5C9.81726 3.5 9.62476 3.3075 9.62476 3.0625V0.4375C9.62476 0.1925 9.81726 0 10.0623 0C10.3073 0 10.4998 0.1925 10.4998 0.4375V3.0625C10.4998 3.3075 10.3073 3.5 10.0623 3.5ZM13.5623 5.25H0.437256C0.192256 5.25 -0.000244141 5.0575 -0.000244141 4.8125C-0.000244141 4.5675 0.192256 4.375 0.437256 4.375H13.5623C13.8073 4.375 13.9998 4.5675 13.9998 4.8125C13.9998 5.0575 13.8073 5.25 13.5623 5.25Z" fill="#7B8794" />
                </g>
                <defs>
                    <clipPath id="clip0_92_4640">
                        <rect width="14" height="14" fill="white" transform="translate(-0.000244141)" />
                    </clipPath>
                </defs>
            </svg>
            <p>Tipo de registro</p>
            <p className={`${(totalRegistros > 0) ? styles.totalUsers : styles.hidden}`}>{totalRegistros}</p>
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.33535 4.10152L5.1479 6.91406L7.96045 4.10151" stroke="#9C9FA1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {
                show &&
                <>
                    <div className={styles.container}>
                        {
                            ['Inicio Jornada', 'Inicio Pausa', 'Fin Pausa', 'Jornada Finalizada'].map((item, index) => {
                                return <label className={styles.option} key={index} onClick={handleLabelClick}>
                                    <SelectOne checkedState={checkedStateRegistro[index]} setCheckedState={setCheckedStateRegistro} id={String(index)} />
                                    <p>{item}</p>
                                </label>
                            })
                        }

                        
                    </div>
                </>
            }
        </div>
    );
}
