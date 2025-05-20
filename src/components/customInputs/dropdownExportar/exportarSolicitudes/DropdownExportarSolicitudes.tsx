'use client'

import { useEffect, useRef, useState } from "react";
import styles from './dropdownExportarSolicitudes.module.css';

export default function DropdownExportarSolicitudes() {

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

    return (
        <div className={styles.containerExportar} ref={dropdownRef} onClick={handleDropdown}>
            <div className={styles.nameContainer}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16.125 9.46177V15.9231C16.125 16.2087 16.0077 16.4826 15.7988 16.6846C15.59 16.8865 15.3067 17 15.0114 17H4.98864C4.69328 17 4.41002 16.8865 4.20118 16.6846C3.99233 16.4826 3.875 16.2087 3.875 15.9231V9.46177C3.875 9.17616 3.99233 8.90225 4.20118 8.70029C4.41002 8.49833 4.69328 8.38488 4.98864 8.38488H6.65909C6.80677 8.38488 6.9484 8.44161 7.05282 8.54258C7.15725 8.64356 7.21591 8.78052 7.21591 8.92332C7.21591 9.06613 7.15725 9.20308 7.05282 9.30406C6.9484 9.40504 6.80677 9.46177 6.65909 9.46177H4.98864V15.9231H15.0114V9.46177H13.3409C13.1932 9.46177 13.0516 9.40504 12.9472 9.30406C12.8428 9.20308 12.7841 9.06613 12.7841 8.92332C12.7841 8.78052 12.8428 8.64356 12.9472 8.54258C13.0516 8.44161 13.1932 8.38488 13.3409 8.38488H15.0114C15.3067 8.38488 15.59 8.49833 15.7988 8.70029C16.0077 8.90225 16.125 9.17616 16.125 9.46177ZM7.60986 6.61205L9.44318 4.83854V11.0771C9.44318 11.2199 9.50185 11.3569 9.60627 11.4578C9.7107 11.5588 9.85232 11.6155 10 11.6155C10.1477 11.6155 10.2893 11.5588 10.3937 11.4578C10.4982 11.3569 10.5568 11.2199 10.5568 11.0771V4.83854L12.3901 6.61205C12.4946 6.71308 12.6363 6.76984 12.7841 6.76984C12.9319 6.76984 13.0736 6.71308 13.178 6.61205C13.2825 6.51101 13.3412 6.37398 13.3412 6.2311C13.3412 6.08821 13.2825 5.95118 13.178 5.85015L10.394 3.15792C10.3422 3.10786 10.2808 3.06814 10.2132 3.04104C10.1456 3.01395 10.0732 3 10 3C9.92683 3 9.85437 3.01395 9.78677 3.04104C9.71918 3.06814 9.65777 3.10786 9.60605 3.15792L6.82196 5.85015C6.71748 5.95118 6.65878 6.08821 6.65878 6.2311C6.65878 6.37398 6.71748 6.51101 6.82196 6.61205C6.92644 6.71308 7.06815 6.76984 7.21591 6.76984C7.36367 6.76984 7.50538 6.71308 7.60986 6.61205Z" fill="#285FF5" />
                </svg>
                Exportar valores
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M0.624999 1.3125L4 4.6875L7.375 1.3125" stroke="#B6BEC9" strokeWidth="1.19998" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {
                show &&
                <>
                    <div className={styles.main}>
                        <div className={styles.options}>
                            <div className={styles.option}>Excel</div>
                            <div className={styles.option}>Pdf</div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}