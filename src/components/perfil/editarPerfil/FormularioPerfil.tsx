'use client'

import { Profile } from '@/types/Types';
import styles from './formularioPerfil.module.css';
import { useEffect, useState } from 'react';
//import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import dayjs from 'dayjs';

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
    const [coste, setCoste] = useState('');
    const [diasVacaciones, setDiasVacaciones] = useState('');

    const [horaLunes, setHoraLunes] = useState({
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

    function parseHora(hora: string | Date | null): string {
        if (!hora) return '';
        return dayjs(hora).isValid() ? dayjs(hora).format("HH:mm") : '';
    }

    const hourRegexp = new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/);

    function handleHoraChange(
        e: React.ChangeEvent<HTMLInputElement>,
        setHora: React.Dispatch<React.SetStateAction<{ value: string; hasError: boolean }>>
    ) {
        setHora({ value: e.target.value, hasError: false });
    }

    function handleHoraBlur(
        hora: { value: string; hasError: boolean },
        setHora: React.Dispatch<React.SetStateAction<{ value: string; hasError: boolean }>>
    ) {
        const hasError = hora.value !== '' && !hourRegexp.test(hora.value);
        setHora((prev) => ({ ...prev, hasError }))
    }

    function handleChangeCoste(e: React.ChangeEvent<HTMLInputElement>) {
        /*let value = e.target.value;

        value = value.replace(',', '.');

        const num = parseFloat(value);

        if (!isNaN(num)) {
            setCoste(num.toFixed(2));  
        } else {
            setCoste('');
        }*/

        setCoste(e.target.value.replace(',', '.'));
    }

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
            setCoste(profile.precio_hora ?? '');
            setDiasVacaciones(profile.dias_vacaciones ?? '');
            setHoraLunes({ value: parseHora(profile.hora_fin_lunes), hasError: false });
            setHoraMartes({ value: parseHora(profile.hora_fin_martes), hasError: false });
            setHoraMiercoles({ value: parseHora(profile.hora_fin_miercoles), hasError: false });
            setHoraJueves({ value: parseHora(profile.hora_fin_jueves), hasError: false });
            setHoraViernes({ value: parseHora(profile.hora_fin_viernes), hasError: false });

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
            setCoste(profile.precio_hora ?? '');
            setDiasVacaciones(profile.dias_vacaciones ?? '');
            setHoraLunes({ value: parseHora(profile.hora_fin_lunes), hasError: false });
            setHoraMartes({ value: parseHora(profile.hora_fin_martes), hasError: false });
            setHoraMiercoles({ value: parseHora(profile.hora_fin_miercoles), hasError: false });
            setHoraJueves({ value: parseHora(profile.hora_fin_jueves), hasError: false });
            setHoraViernes({ value: parseHora(profile.hora_fin_viernes), hasError: false });

        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await fetch('/api/profile/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: profile.id,
                nombre: nombre,
                apellido: apellido,
                email: email,
                puesto: puesto,
                horasSemana: horasSemana,
                telefono: telefono,
                telefonoPersonal: telefonoPersonal,
                coste: coste,
                diasVacaciones: diasVacaciones,
                horaLunes: horaLunes.value,
                horaMartes: horaMartes.value,
                horaMiercoles: horaMiercoles.value,
                horaJueves: horaJueves.value,
                horaViernes: horaViernes.value
            })
        });
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
                        <input type="text" value={horaLunes.value} onChange={(e) => handleHoraChange(e, setHoraLunes)} onBlur={() => handleHoraBlur(horaLunes, setHoraLunes)} />
                        {
                            horaLunes.hasError &&
                            <span style={{ color: 'red' }}>No es una hora válida</span>
                        }
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <div className={styles.formItem}>
                        <h3>Hora de finalización del martes</h3>
                        <input type="text" value={horaMartes.value} onChange={(e) => handleHoraChange(e, setHoraMartes)} onBlur={() => handleHoraBlur(horaMartes, setHoraMartes)} />
                        {
                            horaMartes.hasError &&
                            <span style={{ color: 'red' }}>No es una hora válida</span>
                        }
                    </div>
                    <div className={styles.formItem}>
                        <h3>Hora de finalización del miércoless</h3>
                        <input type="text" value={horaMiercoles.value} onChange={(e) => handleHoraChange(e, setHoraMiercoles)} onBlur={() => handleHoraBlur(horaMiercoles, setHoraMiercoles)} />
                        {
                            horaMiercoles.hasError &&
                            <span style={{ color: 'red' }}>No es una hora válida</span>
                        }
                    </div>
                </div>
                <div className={styles.formGroup}>
                    <div className={styles.formItem}>
                        <h3>Hora de finalización del jueves</h3>
                        <input type="text" value={horaJueves.value} onChange={(e) => handleHoraChange(e, setHoraJueves)} onBlur={() => handleHoraBlur(horaJueves, setHoraJueves)} />
                        {
                            horaJueves.hasError &&
                            <span style={{ color: 'red' }}>No es una hora válida</span>
                        }
                    </div>
                    <div className={styles.formItem}>
                        <h3>Hora de finalización del viernes</h3>
                        <input type="text" value={horaViernes.value} onChange={(e) => handleHoraChange(e, setHoraViernes)} onBlur={() => handleHoraBlur(horaViernes, setHoraViernes)} />
                        {
                            horaViernes.hasError &&
                            <span style={{ color: 'red' }}>No es una hora válida</span>
                        }
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
                            <input type="text" value={diasVacaciones} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiasVacaciones(e.target.value)} />
                        </div>
                        <div className={styles.formItem}>
                            <h3>Costo/hora</h3>
                            <input type="text" value={coste} onChange={handleChangeCoste} />
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
                                <input type="text" value={coste ?? ''} onChange={handleChangeCoste} />
                            </div>
                        </div>
                        <div className={styles.formGroup2}>
                            <div className={styles.formItem}>
                                <h3>Dias de vacaciones anuales</h3>
                                <input type="text" value={diasVacaciones} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiasVacaciones(e.target.value)} />
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