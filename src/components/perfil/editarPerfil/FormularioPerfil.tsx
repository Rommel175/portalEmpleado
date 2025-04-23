'use client'

import { Profile } from '@/types/Types';
import styles from './formularioPerfil.module.css';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Props = {
    profile: Profile[],
    isAdmin?: boolean
}

export default function FormularioPerfil({ profile, isAdmin }: Props) {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [puesto, setPuesto] = useState('');
    const [horasSemana, setHorasSemana] = useState('');
    const [emailPersonal, setEmailPersonal] = useState('');
    const [telefono, setTelefono] = useState('');
    const [telefonoPersonal, setTelefonoPersonal] = useState('');

    useEffect(() => {
        if (profile[0]) {
            setNombre(profile[0].nombre ?? '');
            setApellido(profile[0].apellido ?? '');
            setEmail(profile[0].email ?? '');
            setPuesto(profile[0].puesto ?? '');
            setHorasSemana(String(profile[0].horas_semana) ?? '');
            setEmailPersonal(profile[0].email_personal ?? '');
            setTelefono(profile[0].telefono_empresa ?? '');
            setTelefonoPersonal(profile[0].telefono_personal ?? '');
        }
    }, [profile]);

    function resetForm() {
        if (profile[0]) {
            setNombre(profile[0].nombre ?? '');
            setApellido(profile[0].apellido ?? '');
            setEmail(profile[0].email ?? '');
            setPuesto(profile[0].puesto ?? '');
            setHorasSemana(String(profile[0].horas_semana) ?? '');
            setEmailPersonal(profile[0].email_personal ?? '');
            setTelefono(profile[0].telefono_empresa ?? '');
            setTelefonoPersonal(profile[0].telefono_personal ?? '');
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
            .update({ nombre: nombre, apellido: apellido, email: email, puesto: puesto, horas_semana: horasSemana, email_personal: emailPersonal, telefono_empresa: telefono, telefono_personal: telefonoPersonal })
            .eq('id', profile[0].id)

        if (errorUpdate) {
            console.log('Error updating Profile: ', errorUpdate);
        }

        const { data: fichaje, error: errorFichaje } = await supabase
            .from('fichaje_jornada')
            .select('id, date')
            .eq('profile_id', profile[0].id)
            .gte('date', startDate.toISOString())
            .lt('date', endDate.toISOString())

        if (errorFichaje) {
            console.log('Error fetching jornada: ', errorFichaje)
        }

        console.log(fichaje);

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
                        <h3>Correo electrónico empresa</h3>
                        <input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.formItem}>
                        <h3>Correo electrónico personal</h3>
                        <input type="email" value={emailPersonal} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailPersonal(e.target.value)} />
                    </div>
                </div>
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
                <div className={styles.formGroup}>
                    <div className={styles.formItem}>
                        <h3>Cargo</h3>
                        {
                            isAdmin &&
                            <input type="text" value={puesto} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPuesto(e.target.value)} />
                        }

                        {
                            !isAdmin &&
                            <input type="text" value={puesto} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPuesto(e.target.value)} disabled />
                        }
                    </div>
                </div>
            </div>
            <div className={styles.form}>
                <h3>Configuraciones de hora de finalización</h3>
                <div className={styles.formGroup}>
                    <div className={styles.formItem}>
                        <h3>Zona horaria</h3>
                        {
                            isAdmin &&
                            <select>
                                <option value="pst">PST</option>
                            </select>
                        }

                        {
                            !isAdmin &&
                            <select disabled>
                                <option value="pst">PST</option>
                            </select>
                        }
                    </div>
                    <div className={styles.formItem}>
                        <h3>Horas semanales</h3>
                        {
                            isAdmin &&
                            <input type="text" value={horasSemana} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHorasSemana(e.target.value)} />
                        }

                        {
                            !isAdmin &&
                            <input type="text" value={horasSemana} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHorasSemana(e.target.value)} disabled />
                        }
                    </div>
                </div>
            </div>
            <div className={styles.buttons}>
                <input type="button" onClick={resetForm} value="Denegar" />
                <input type="submit" value="Guardar cambios" />
            </div>
        </form>
        /*<form className={styles.wraper} onSubmit={handleSubmit}>
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
                         {
                             isAdmin &&
                             <input type="text" value={puesto} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPuesto(e.target.value)} />
                         }
 
                         {
                             !isAdmin && 
                             <input type="text" value={puesto} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPuesto(e.target.value)} disabled />
                         }
                         
                     </div>
                     <div className={styles.formItem}>
                         <h3>Correo electrónico</h3>
                         <input type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                     </div>
                 </div>
                 
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
                         <h3>Hora de finalización del miércoles</h3>
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
             <div className={styles.buttons}>
                 <input type="button" onClick={resetForm} value="Denegar" />
                 <input type="submit" value="Guardar cambios" />
             </div>
         </form>*/

    );
}