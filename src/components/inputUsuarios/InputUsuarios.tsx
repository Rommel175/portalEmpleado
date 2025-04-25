'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './inputUsuarios.module.css';
import { createClient } from '@/utils/supabase/client';
type Props = {
    checkedState: { [key: string]: boolean };
    setCheckedState: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

export default function InputUsuarios({checkedState, setCheckedState}: Props) {
    const [show, setShow] = useState(false);
    const supabase = createClient();
    const [profiles, setProfiles] = useState<{ name: string; id: string }[]>([]); 
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.auth.getUser();
            const user = data.user;

            const { data: dataProfiles, error: errorProfiles } = await supabase
                .from('profiles')
                .select('nombre, apellido, id')
                .neq('user_id', user?.id)

            if (errorProfiles) {
                console.log('Error fetching Profiles: ', errorProfiles);
            }

            if (dataProfiles && dataProfiles.length > 0) {
                const profileData: { name: string; id: string }[] = [];

                dataProfiles.map((item) => {
                    profileData.push({ name: `${item.nombre} ${item.apellido}`, id: item.id });
                })

                setProfiles(profileData);
            }
        }

        fetchData();

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

    function handleCheckboxChange(id: string) {
        setCheckedState((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    }

    function handleDropdown() {
        setShow(prevState => !prevState);
    }

    function handleLabelClick(e: React.MouseEvent) {
        e.stopPropagation();
    }

    return (
        <div className={styles.filtro} onClick={handleDropdown} ref={dropdownRef}>
            {
                JSON.stringify(checkedState)
            }
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.03363 2.07983C7.2329 2.07983 6.46496 2.39792 5.89876 2.96413C5.33256 3.53033 5.01447 4.29826 5.01447 5.09899C5.01447 5.89972 5.33256 6.66766 5.89876 7.23386C6.46496 7.80006 7.2329 8.11815 8.03363 8.11815C8.83436 8.11815 9.60229 7.80006 10.1685 7.23386C10.7347 6.66766 11.0528 5.89972 11.0528 5.09899C11.0528 4.29826 10.7347 3.53033 10.1685 2.96413C9.60229 2.39792 8.83436 2.07983 8.03363 2.07983ZM5.96789 5.09899C5.96789 4.55112 6.18553 4.0257 6.57293 3.63829C6.96033 3.25089 7.48576 3.03325 8.03363 3.03325C8.5815 3.03325 9.10693 3.25089 9.49433 3.63829C9.88173 4.0257 10.0994 4.55112 10.0994 5.09899C10.0994 5.64686 9.88173 6.17229 9.49433 6.55969C9.10693 6.94709 8.5815 7.16473 8.03363 7.16473C7.48576 7.16473 6.96033 6.94709 6.57293 6.55969C6.18553 6.17229 5.96789 5.64686 5.96789 5.09899ZM8.03363 8.48485C6.56346 8.48485 5.20833 8.81918 4.2047 9.38361C3.21569 9.9404 2.47202 10.7832 2.47202 11.8218V11.8866C2.47138 12.6252 2.47075 13.552 3.2837 14.2143C3.6835 14.5397 4.24347 14.7717 4.99985 14.9242C5.7575 15.0781 6.74588 15.1588 8.03363 15.1588C9.32138 15.1588 10.3091 15.0781 11.068 14.9242C11.8244 14.7717 12.3838 14.5397 12.7842 14.2143C13.5971 13.552 13.5952 12.6252 13.5952 11.8866V11.8218C13.5952 10.7832 12.8516 9.9404 11.8632 9.38361C10.8589 8.81918 9.50444 8.48485 8.03363 8.48485ZM3.42544 11.8218C3.42544 11.2809 3.82079 10.6936 4.67187 10.215C5.50834 9.74464 6.69566 9.43827 8.03426 9.43827C9.37159 9.43827 10.5589 9.74464 11.3954 10.215C12.2471 10.6936 12.6418 11.2809 12.6418 11.8218C12.6418 12.6532 12.6164 13.121 12.1816 13.4744C11.9465 13.6664 11.5524 13.8539 10.8786 13.9899C10.2068 14.1259 9.28833 14.2054 8.03363 14.2054C6.77893 14.2054 5.85983 14.1259 5.18863 13.9899C4.51488 13.8539 4.1208 13.6664 3.88562 13.475C3.45086 13.121 3.42544 12.6532 3.42544 11.8218Z" fill="#7B8794" />
            </svg>
            <p>Usuarios</p>
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.33535 4.10152L5.1479 6.91406L7.96045 4.10151" stroke="#9C9FA1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {
                show &&
                <>
                    <div className={styles.container}>
                        {
                            profiles.map((item) => {
                                return <label className={styles.option} key={item.id} onClick={handleLabelClick}>
                                    <input type="checkbox" checked={checkedState[item.id] || false} onChange={() => handleCheckboxChange(item.id)} />
                                    <p>{item.name}</p>
                                </label>
                            })
                        }
                    </div>
                </>
            }
        </div>
    );
}
