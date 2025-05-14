import { useEffect, useRef, useState } from 'react';
import styles from './location.module.css';

export default function Location({
    localizacion,
    setLocalizacion
}: {
    localizacion: string;
    setLocalizacion: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [show, setShow] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShow(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function handleDropdown(e: React.MouseEvent) {
        e.stopPropagation();
        setShow(prev => !prev);
    }

    function handleSelect(e: React.MouseEvent, valor: string) {
        e.stopPropagation(); // ¡importante para evitar que reabra!
        setLocalizacion(valor);
        setShow(false);
    }

    function getLabel(valor: string) {
        switch (valor) {
            case 'all': return 'Ubicación';
            case 'oficina': return 'Oficina';
            case 'casa': return 'Casa';
            case 'viaje': return 'Viaje';
            default: return 'Ubicación';
        }
    }

    return (
        <div className={styles.containerLocation} ref={dropdownRef}>
            <div className={styles.selector} onClick={handleDropdown}>
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.0545 7.27579C13.0545 11.094 8.14542 14.3667 8.14542 14.3667C8.14542 14.3667 3.23633 11.094 3.23633 7.27579C3.23633 5.97382 3.75353 4.72517 4.67417 3.80454C5.5948 2.88391 6.84345 2.3667 8.14542 2.3667C9.44739 2.3667 10.696 2.88391 11.6167 3.80454C12.5373 4.72517 13.0545 5.97382 13.0545 7.27579Z" stroke="#7B8794" strokeWidth="0.818182" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8.14542 8.91215C9.04916 8.91215 9.78178 8.17953 9.78178 7.27579C9.78178 6.37205 9.04916 5.63943 8.14542 5.63943C7.24168 5.63943 6.50906 6.37205 6.50906 7.27579C6.50906 8.17953 7.24168 8.91215 8.14542 8.91215Z" stroke="#7B8794" strokeWidth="0.818182" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {getLabel(localizacion)}
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                    <rect width="11.9999" height="11.9999" transform="translate(12.3333) rotate(90)" fill="white" />
                    <path
                        d="M3.13627 4.32204L6.51125 7.69702L9.88623 4.32204"
                        stroke="#7B8794"
                        strokeWidth="1.19997"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {show && (
                <div className={styles.options}>
                    <div className={styles.option} onClick={(e) => handleSelect(e, 'all')}>
                        <p>Ubicación</p>
                    </div>
                    <div className={styles.option} onClick={(e) => handleSelect(e, 'oficina')}>
                        <p>Oficina</p>
                    </div>
                    <div className={styles.option} onClick={(e) => handleSelect(e, 'casa')}>
                        <p>Casa</p>
                    </div>
                    <div className={styles.option} onClick={(e) => handleSelect(e, 'viaje')}>
                        <p>Viaje</p>
                    </div>
                </div>
            )}
        </div>
    );
}
