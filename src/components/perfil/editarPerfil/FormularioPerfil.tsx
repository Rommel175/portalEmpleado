'use client'

import { Profile } from '@/types/Types';
import styles from './formularioPerfil.module.css';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

type Props = {
    profile: Profile,
    isAdmin?: boolean
}

export default function FormularioPerfil({ profile, isAdmin }: Props) {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [puesto, setPuesto] = useState('');
    const [horasSemana, setHorasSemana] = useState('');
    //const [emailPersonal, setEmailPersonal] = useState('');
    const [telefono, setTelefono] = useState('');
    const [telefonoPersonal, setTelefonoPersonal] = useState('');
    
    /*const [horaLunes, setHoraLunes] = useState({
        value: '',
        hasError: false
    });

    const [horaMartes, setHoraMartes] = useState({
        value: '',
        hasError: false
    });

    const [horaMiercoles, setHoraMiercoles] = useState({
        value: '',
        hasError: false
    });

    const [horaJueves, setHoraJueves] = useState({
        value: '',
        hasError: false
    });

    const [horaViernes, setHoraViernes] = useState({
        value: '',
        hasError: false
    });

    const hourRegexp = new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/);

    function handleChangeHoraLunes(e: React.ChangeEvent<HTMLInputElement>) {
        setHoraLunes({ ...horaLunes, value: e.target.value });
    }

    function handleBlurHoraLunes() {
        const hasError = !hourRegexp.test(horaLunes.value);
        setHoraLunes((prev) => ({ ...prev, hasError }))
    }*/

    useEffect(() => {
        if (profile) {
            setNombre(profile.nombre ?? '');
            setApellido(profile.apellido ?? '');
            setEmail(profile.email ?? '');
            setPuesto(profile.puesto ?? '');
            setHorasSemana(String(profile.horas_semana) ?? '');
            //setEmailPersonal(profile.email_personal ?? '');
            setTelefono(profile.telefono_empresa ?? '');
            setTelefonoPersonal(profile.telefono_personal ?? '');
        }
    }, [profile]);

    function resetForm() {
        if (profile) {
            setNombre(profile.nombre ?? '');
            setApellido(profile.apellido ?? '');
            setEmail(profile.email ?? '');
            setPuesto(profile.puesto ?? '');
            setHorasSemana(String(profile.horas_semana) ?? '');
            //setEmailPersonal(profile.email_personal ?? '');
            setTelefono(profile.telefono_empresa ?? '');
            setTelefonoPersonal(profile.telefono_personal ?? '');
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const startDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 1);

        const supabase = createClient();

        const { error: errorUpdate } = await supabase
            .from('profiles')
            .update({ nombre: nombre, apellido: apellido, email: email, puesto: puesto, horas_semana: horasSemana, telefono_empresa: telefono, telefono_personal: telefonoPersonal })
            .eq('id', profile.id)

        if (errorUpdate) {
            console.log('Error updating Profile: ', errorUpdate);
        }

        const { data: fichaje, error: errorFichaje } = await supabase
            .from('fichaje_jornada')
            .select('id, date')
            .eq('profile_id', profile.id)
            .gte('date', startDate.toISOString())
            .lt('date', endDate.toISOString())

        if (errorFichaje) {
            console.log('Error fetching jornada: ', errorFichaje)
        }

        if (fichaje && fichaje.length > 0) {
            const date = new Date(fichaje[0].date);
            const horasTrabajo = Number(horasSemana) / 5;
            date.setHours(date.getHours() + horasTrabajo);

            const { error: errorUpdating } = await supabase
                .from('fichaje_jornada')
                .update({ date_final_aprox: date.toISOString() })
                .eq('id', fichaje[0].id);

            if (errorUpdating) {
                console.log('Error updating jotnada: ', errorUpdating);
            }
        }
    }

    return (

        <form className={styles.wraper} onSubmit={handleSubmit}>
            <div className={styles.profile}>
                <Image src={profile.image} width={60} height={60} alt="img" />
                <button className={styles.cambioImagen}>Cambiar Imagen</button>
            </div>

            <div className={styles.form}>
                <h3>Información personal</h3>
                <div className={styles.formGroup}>
                    <div className={styles.formItem}>
                        <h3>Nombre</h3>
                        <input type="text" value={nombre} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)} />
                    </div>
                    <div className={styles.formItem}>
                        <h3>Apellido</h3>
                        <input type="text" value={apellido} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApellido(e.target.value)} />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <div className={styles.formItem}>
                        <h3>Cargo</h3>
                        <input type="text" value={puesto} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPuesto(e.target.value)} />
                    </div>
                    <div className={styles.formItem}>
                        <h3>Correo electrónico</h3>
                        <input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                    </div>
                </div>

                {
                    isAdmin &&
                    <div className={styles.formGroup}>
                        <div className={styles.formItem}>
                            <h3>Teléfono empresa</h3>
                            <input type="tel" value={telefono} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefono(e.target.value)} />
                        </div>
                        <div className={styles.formItem}>
                            <h3>Teléfono personal</h3>
                            <input type="tel" value={telefonoPersonal} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelefonoPersonal(e.target.value)} />
                        </div>
                    </div>
                }

            </div>

            <div className={styles.form}>
                <h3>Configuraciones de hora de finalización</h3>
                <div className={styles.formGroup}>
                    <div className={styles.formItem}>
                        <h3>Zona horaria</h3>
                        <select>
                            <option value="pst">PST</option>
                        </select>
                    </div>
                    <div className={styles.formItem}>
                        <h3>Hora de finalización del lunes</h3>
                        <input type="text" />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <div className={styles.formItem}>
                        <h3>Hora de finalización del martes</h3>
                        <input type="text" />
                    </div>
                    <div className={styles.formItem}>
                        <h3>Hora de finalización del miércoless</h3>
                        <input type="text" />
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <div className={styles.formItem}>
                        <h3>Hora de finalización del jueves</h3>
                        <input type="text" />
                    </div>
                    <div className={styles.formItem}>
                        <h3>Hora de finalización del viernes</h3>
                        <input type="text" />
                    </div>
                </div>
            </div>

            {
                (!isAdmin) &&
                <div className={styles.form}>
                    <h3>Vacaciones y Tarifa horaria</h3>
                    <div className={styles.formGroup}>
                        <div className={styles.formItem}>
                            <h3>Dias de vacaciones anuales</h3>
                            <input type="text" />
                        </div>
                        <div className={styles.formItem}>
                            <h3>Costo/hora</h3>
                            <input type="text" />
                        </div>
                    </div>
                </div>
            }

            {
                (isAdmin) &&
                <>
                    <div className={styles.form}>
                        <h3>Vacaciones y Tarifa horaria</h3>
                        <div className={styles.formGroup}>
                            <div className={styles.formItem}>
                                <h3>Horas semanales</h3>
                                <input type="text" value={horasSemana} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHorasSemana(e.target.value)} />
                            </div>
                            <div className={styles.formItem}>
                                <h3>Costo/hora</h3>
                                <input type="text" />
                            </div>
                        </div>
                        <div className={styles.formGroup2}>
                            <div className={styles.formItem}>
                                <h3>Dias de vacaciones anuales</h3>
                                <input type="text" />
                            </div>
                        </div>

                    </div>
                </>
            }

            <div className={styles.buttons}>
                <input type="button" onClick={resetForm} value="Denegar" />
                <input type="submit" value="Guardar cambios" />
            </div>
        </form>
    );
}