'use client'

import { User } from "@supabase/supabase-js";
import styles from './containerDatos.module.css'
import ContainerHeader from "../../ContainerHeader";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type Profile = {
    fullName: string,
    email: string,
    image: string,
    puesto: string
}

export default function DatosContainer({ user, estado, localizacionFichaje, setLocalizacionFichaje, horaInicio, horaFinalAprox }: { user: User, estado: string, localizacionFichaje: string, setLocalizacionFichaje: React.Dispatch<React.SetStateAction<string>>, horaInicio: string, horaFinalAprox: string }) {
    const svg = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
            <path fillRule="evenodd" clipRule="evenodd" d="M12.0505 2.36951C10.8494 2.36951 9.69748 2.84664 8.84817 3.69594C7.99887 4.54525 7.52174 5.69715 7.52174 6.89825C7.52174 8.09934 7.99887 9.25124 8.84817 10.1005C9.69748 10.9499 10.8494 11.427 12.0505 11.427C13.2516 11.427 14.4035 10.9499 15.2528 10.1005C16.1021 9.25124 16.5792 8.09934 16.5792 6.89825C16.5792 5.69715 16.1021 4.54525 15.2528 3.69594C14.4035 2.84664 13.2516 2.36951 12.0505 2.36951ZM8.95186 6.89825C8.95186 6.07644 9.27832 5.2883 9.85943 4.7072C10.4405 4.12609 11.2287 3.79963 12.0505 3.79963C12.8723 3.79963 13.6604 4.12609 14.2415 4.7072C14.8226 5.2883 15.1491 6.07644 15.1491 6.89825C15.1491 7.72005 14.8226 8.50819 14.2415 9.08929C13.6604 9.6704 12.8723 9.99686 12.0505 9.99686C11.2287 9.99686 10.4405 9.6704 9.85943 9.08929C9.27832 8.50819 8.95186 7.72005 8.95186 6.89825ZM12.0505 11.977C9.84522 11.977 7.81253 12.4785 6.30708 13.3252C4.82356 14.1604 3.70806 15.4246 3.70806 16.9825V17.0797C3.70711 18.1876 3.70615 19.5777 4.92558 20.5711C5.52528 21.0593 6.36524 21.4073 7.49981 21.6361C8.63628 21.8668 10.1188 21.9879 12.0505 21.9879C13.9821 21.9879 15.4637 21.8668 16.6021 21.6361C17.7367 21.4073 18.5757 21.0593 19.1763 20.5711C20.3957 19.5777 20.3938 18.1876 20.3929 17.0797V16.9825C20.3929 15.4246 19.2774 14.1604 17.7948 13.3252C16.2884 12.4785 14.2567 11.977 12.0505 11.977ZM5.13819 16.9825C5.13819 16.1711 5.73122 15.2902 7.00784 14.5722C8.26254 13.8667 10.0435 13.4072 12.0514 13.4072C14.0574 13.4072 15.8384 13.8667 17.0931 14.5722C18.3707 15.2902 18.9628 16.1711 18.9628 16.9825C18.9628 18.2296 18.9246 18.9313 18.2725 19.4614C17.9197 19.7493 17.3286 20.0306 16.318 20.2346C15.3102 20.4386 13.9325 20.5578 12.0505 20.5578C10.1684 20.5578 8.78978 20.4386 7.78297 20.2346C6.77235 20.0306 6.18123 19.7493 5.82846 19.4623C5.17633 18.9313 5.13819 18.2296 5.13819 16.9825Z" fill="#0B3C70" />
        </svg>
    )

    const [perfil, setPerfil] = useState<Profile | null>(null);

    const supabase = createClient();

    async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setLocalizacionFichaje(e.target.value);
    }

    useEffect(() => {

        const fetchPuesto = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('puesto, full_name, image, email')
                .eq('user_id', user.id)

            if (error) {
                console.log('Error fetching Puesto: ', error);
            }

            if (data && data.length > 0) {
                setPerfil({
                    fullName: data[0].full_name,
                    image: data[0].image,
                    puesto: data[0].puesto,
                    email: data[0].email
                });
            }

            if (!data || data.length == 0 || !data[0].puesto) {

                setPerfil({
                    fullName: user.user_metadata.full_name,
                    image: user.user_metadata.avatar_url,
                    puesto: 'No especificado',
                    email: user.user_metadata.email
                });
            }

        }

        fetchPuesto();
    }, [])

    return (
        <div className={styles.container}>
            <ContainerHeader name={'Mis datos'} svg={svg} />

            <div className={styles.content}>

                {
                    perfil && (
                        <div className={styles.profile}>
                            {perfil.image ? (
                                <Image
                                    src={perfil.image}
                                    width={60}
                                    height={60}
                                    alt="img"
                                    className={styles.personalImage}
                                />
                            ) : null}
                            <div className={styles.personalInfo}>
                                <h2>{perfil.fullName}</h2>
                                <h3>{perfil.puesto} | {perfil.email}</h3>
                            </div>
                        </div>
                    )
                }

                <div className={styles.line}></div>

                <div className={styles.mainContent}>
                    <div>
                        <h4>Estado</h4>
                        <div className={styles.state}>
                            {
                                (estado == 'Activo') &&
                                <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3.5" cy="3" r="3" fill="#0DC44A" />
                                </svg>
                            }

                            {
                                (estado == 'Inactivo') &&
                                <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3.5" cy="3.5" r="3" fill="#E94544" />
                                </svg>
                            }

                            {
                                (estado == 'Pausa') &&
                                <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3.5" cy="3.5" r="3" fill="#FF6E00" />
                                </svg>
                            }

                            {
                                (estado == 'Jornada Finalizada') &&
                                <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="3.5" cy="3.5" r="3" fill="#828282" />
                                </svg>
                            }

                            <p>{estado}</p>
                        </div>
                    </div>

                    <div>
                        <h4>Ubicación</h4>
                        <select name="localizacion" id="localizacion" className={styles.location} value={localizacionFichaje} onChange={handleChange}>
                            <option value="oficina">Oficina</option>
                            <option value="casa">Casa</option>
                            <option value="viaje">Viaje</option>
                        </select>
                    </div>

                    <div>
                        <h4>Hora Inicio Jornada</h4>
                        <div className={styles.inicio}>
                            <p>{horaInicio}</p>
                        </div>
                    </div>

                    <div>
                        <div>
                            <h4>Hora Prev Fin Jornada</h4>
                            <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.975 9.49988C6.15 9.49988 6.298 9.43938 6.419 9.31838C6.54 9.19738 6.60033 9.04955 6.6 8.87488C6.59967 8.70021 6.53933 8.55221 6.419 8.43088C6.29867 8.30955 6.15067 8.24921 5.975 8.24988C5.79933 8.25055 5.6515 8.31105 5.5315 8.43138C5.4115 8.55171 5.351 8.69955 5.35 8.87488C5.349 9.05021 5.4095 9.19821 5.5315 9.31888C5.6535 9.43955 5.80133 9.49988 5.975 9.49988ZM5.525 7.57488H6.45C6.45 7.29988 6.48133 7.08321 6.544 6.92488C6.60667 6.76655 6.78367 6.54988 7.075 6.27488C7.29167 6.05821 7.4625 5.85188 7.5875 5.65588C7.7125 5.45988 7.775 5.22455 7.775 4.94988C7.775 4.48321 7.60417 4.12488 7.2625 3.87488C6.92083 3.62488 6.51667 3.49988 6.05 3.49988C5.575 3.49988 5.18967 3.62488 4.894 3.87488C4.59833 4.12488 4.392 4.42488 4.275 4.77488L5.1 5.09988C5.14167 4.94988 5.2355 4.78738 5.3815 4.61238C5.5275 4.43738 5.75033 4.34988 6.05 4.34988C6.31667 4.34988 6.51667 4.42288 6.65 4.56888C6.78333 4.71488 6.85 4.87521 6.85 5.04988C6.85 5.21655 6.8 5.37288 6.7 5.51888C6.6 5.66488 6.475 5.80021 6.325 5.92488C5.95833 6.24988 5.73333 6.49571 5.65 6.66238C5.56667 6.82905 5.525 7.13321 5.525 7.57488ZM6 11.4999C5.30833 11.4999 4.65833 11.3687 4.05 11.1064C3.44167 10.844 2.9125 10.4877 2.4625 10.0374C2.0125 9.58705 1.65633 9.05788 1.394 8.44988C1.13167 7.84188 1.00033 7.19188 1 6.49988C0.999667 5.80788 1.131 5.15788 1.394 4.54988C1.657 3.94188 2.01317 3.41271 2.4625 2.96238C2.91183 2.51205 3.441 2.15588 4.05 1.89388C4.659 1.63188 5.309 1.50055 6 1.49988C6.691 1.49921 7.341 1.63055 7.95 1.89388C8.559 2.15721 9.08817 2.51338 9.5375 2.96238C9.98683 3.41138 10.3432 3.94055 10.6065 4.54988C10.8698 5.15921 11.001 5.80921 11 6.49988C10.999 7.19055 10.8677 7.84055 10.606 8.44988C10.3443 9.05921 9.98817 9.58838 9.5375 10.0374C9.08683 10.4864 8.55767 10.8427 7.95 11.1064C7.34233 11.37 6.69233 11.5012 6 11.4999Z" fill="#333333" />
                            </svg>
                        </div>
                        <div className={styles.final}>
                            <p>{horaFinalAprox}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}