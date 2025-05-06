'use client'

import { Profile } from '@/types/Types';
import styles from './informacionUsuario.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export default function InformacionUsuario({ profile }: { profile: Profile }) {

    const [nombre, setNombre] = useState(profile.nombre);
    const [apellido, setApellido] = useState(profile.apellido);
    const [puesto, setPuesto] = useState(profile.puesto);
    const [email, setEmail] = useState(profile.email);

    const supabase = createClient();

    useEffect(() => {
        const profilesRealTime = supabase
            .channel('realtime-edit-profiles')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
            }, (payload: RealtimePostgresChangesPayload<Profile>) => {
                switch (payload.eventType) {
                    case 'UPDATE':
                        const updatedItem = payload.new;
                        setNombre(updatedItem.nombre);
                        setApellido(updatedItem.apellido);
                        setPuesto(updatedItem.puesto);
                        setEmail(updatedItem.email);
                        break;
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(profilesRealTime);
        };
    }, [])


    return (
        <div className={styles.profile}>
            <Image src={profile.image} width={60} height={60} alt="img" />
            <div className={styles.containerInfo}>
                <div className={styles.personalInfo}>
                    <h2>{nombre} {apellido}</h2>
                    <h2>{puesto || 'No especificado'} | {email}</h2>
                </div>
            </div>
        </div>
    );
}