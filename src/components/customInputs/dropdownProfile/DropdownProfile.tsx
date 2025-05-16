'use client'

import Image from 'next/image';
import styles from './dropdownProfile.module.css';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function DropdownProfile({ image, nombre, apellido, email }: { image: string, nombre: string, apellido: string, email: string }) {
    const [show, setShow] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const supabase = createClient();
    const router = useRouter();

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

    async function handleLogOut() {
        await supabase.auth.signOut();   
        router.push('/login')
    }

    return (
        <div className={styles.containerImage} ref={dropdownRef} onClick={handleDropdown}>
            <Image src={image} width={32} height={32} alt='img' className={styles.navImage} style={{cursor: 'pointer'}} />
            {
                show &&
                <>
                    <div className={styles.main}>
                        <div className={styles.personalInfo}>
                            <Image src={image} width={38} height={38} alt='img' className={styles.imageProfile} />
                            <div className={styles.name}>
                                <h3>{nombre || ''} {apellido || ''}</h3>
                                <h4>{email}</h4>
                            </div>
                        </div>
                        <div className={styles.options}>
                            <div className={styles.option}>
                                <Link href={'/dashboard/editar_perfil'}>Gestionar cuenta</Link>
                            </div>
                            <div className={styles.option} onClick={handleLogOut}>
                                <p>Cerrar sesión</p>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}