'use client';

import { useState } from "react";
import styles from './customSelect.module.css';

export default function CustomSelect({ localizacionFichaje, setLocalizacionFichaje, options }: { localizacionFichaje: string, setLocalizacionFichaje: React.Dispatch<React.SetStateAction<string>>, options: string[] }) {
    const [show, setShow] = useState(false);
    function handleSelect(option: string) {
        setLocalizacionFichaje(option);
        setShow(false);
    }

    return (
        <div className={styles.customSelect} onClick={() => setShow(!show)}>
            {localizacionFichaje.charAt(0).toUpperCase() + localizacionFichaje.slice(1)}
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                <rect width="11.9999" height="11.9999" transform="translate(12.3333) rotate(90)" fill="white" />
                <path d="M3.13627 4.32204L6.51125 7.69702L9.88623 4.32204" stroke="#7B8794" strokeWidth="1.19997" strokeLinecap="round" strokeLinejoin="round" />
            </svg>



            {show && (
                <div className={styles.options}>
                    {options.map((opcion) => (
                        <div
                            key={opcion}
                            onClick={() => handleSelect(opcion)}
                            className={styles.option}
                        >
                            <p>{opcion}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}