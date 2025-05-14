import { useEffect, useRef, useState } from 'react';
import styles from './recientes.module.css';

export default function Recientes({ reciente, setReciente }: { reciente: boolean, setReciente: React.Dispatch<React.SetStateAction<boolean>> }) {
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

    function handleSelect(e: React.MouseEvent, valor: boolean) {
        e.stopPropagation();
        setReciente(valor);
        setShow(false);
    }

    return (
        <div className={styles.containerRecientes} onClick={handleDropdown} ref={dropdownRef}>
            <div className={styles.selector} onClick={handleDropdown}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.36157 5.38037H10.3699V6.19704H4.36157V5.38037ZM4.36157 8.2387H10.3699V9.05537H4.36157V8.2387ZM4.76991 11.097H4.36157V11.9137H9.55324V11.097H4.76991ZM12.0032 12.4911L12.2919 12.2024L13.5169 10.9774L13.8056 10.6887L13.2282 10.1113L12.9395 10.4L12.4116 10.928V5.38037H11.5949V10.928L11.0669 10.4L10.7782 10.1113L10.2009 10.6887L10.4895 10.9774L11.7145 12.2024L12.0032 12.4911Z" fill="#7B8794" />
                </svg>
                {reciente ? 'Más recientes' : 'Menos recientes'}
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
                    <div className={styles.option} onClick={(e) => handleSelect(e, true)}>
                        <p>Más recientes</p>
                    </div>
                    <div className={styles.option} onClick={(e) => handleSelect(e, false)}>
                        <p>Menos recientes</p>
                    </div>
                </div>
            )}
        </div>
    );
}
