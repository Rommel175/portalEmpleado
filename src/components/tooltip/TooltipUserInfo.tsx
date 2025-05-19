'use client';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import styles from './tooltipUserInfo.module.css';
import { Profile } from '@/types/Types';
import Image from 'next/image';

type TooltipProps = {
    children: React.ReactNode,
    id: string
}

export default function TooltipUserInfo({ children, id }: TooltipProps) {

    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const params = new URLSearchParams({
                profileId: id,
            });

            const res = await fetch(`/api/profile?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                console.error('Error en la respuesta:', res.status);
                return;
            }

            const result = await res.json();

            if (result.success) {
                setProfile(result.profile)
            }

            //console.log(result.profile);
        }

        fetchData();
    }, [id])


    return (
        <>
            <div data-tooltip-id={`tooltip-profile-${id}`}>
                {children}
            </div>
            <Tooltip
                id={`tooltip-profile-${id}`}
                place='bottom-start'
                noArrow
                className={styles.tooltipCustom}
                openOnClick
            >
                <div className={styles.header}></div>
                <div className={styles.mainContent}>
                    <div className={styles.personalInfo}>
                        <h2>{profile?.nombre || ''} {profile?.apellido || ''}</h2>
                        <h3>{profile?.email}</h3>
                    </div>
                    <div className={styles.contact}>
                        <div className={styles.itemContact}>
                            <h2>Email</h2>
                            <h3>{profile?.email}</h3>
                        </div>
                        <div className={styles.itemContact}>
                            <h2>Telefono empresa</h2>
                            <h3>{profile?.telefono_empresa || ''}</h3>
                        </div>
                        <div className={styles.itemContact}>
                            <h2>Telefono personal</h2>
                            <h3>{profile?.telefono_empresa || ''}</h3>
                        </div>
                    </div>
                    <div className={styles.icon}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="14" viewBox="0 0 19 14" fill="none">
                                <path d="M16.7578 13.5001H2.38102C1.46312 13.5001 0.722168 12.7591 0.722168 11.8412V1.8881C0.722168 0.970203 1.46312 0.229248 2.38102 0.229248H16.7578C17.6757 0.229248 18.4166 0.970203 18.4166 1.8881V11.8412C18.4166 12.7591 17.6757 13.5001 16.7578 13.5001ZM2.38102 1.33515C2.07137 1.33515 1.82807 1.57845 1.82807 1.8881V11.8412C1.82807 12.1509 2.07137 12.3942 2.38102 12.3942H16.7578C17.0674 12.3942 17.3107 12.1509 17.3107 11.8412V1.8881C17.3107 1.57845 17.0674 1.33515 16.7578 1.33515H2.38102Z" fill="#B6BEC9" />
                                <path d="M9.5695 9.03235C8.79537 9.03235 8.08759 8.72269 7.55676 8.15868L1.75077 1.98775C1.54065 1.76656 1.55171 1.41268 1.77289 1.20255C1.99407 0.992433 2.34796 1.00349 2.55808 1.22467L8.36407 7.39561C8.99443 8.07021 10.1446 8.07021 10.7749 7.39561L16.5809 1.23573C16.7911 1.01455 17.1449 1.00349 17.3661 1.21361C17.5873 1.42373 17.5984 1.77762 17.3882 1.9988L11.5822 8.16974C11.0514 8.73375 10.3436 9.04341 9.5695 9.04341V9.03235Z" fill="#B6BEC9" />
                            </svg>
                        </div>
                    </div>
                </div>
                {profile?.image && (
                    <Image
                        src={profile.image}
                        width={60}
                        height={60}
                        alt="img-profile"
                        className={styles.img}
                    />
                )}
            </Tooltip>
        </>
    );
}
