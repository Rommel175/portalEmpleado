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

    useEffect(() => {
        if (profile[0]) {
            setNombre(profile[0].nombre ?? '');
            setApellido(profile[0].apellido ?? '');
            setEmail(profile[0].email ?? '');
            setPuesto(profile[0].puesto ?? '');
            setHorasSemana(String(profile[0].horas_semana));
        }
    }, [profile]);

    function resetForm() {
        if (profile[0]) {
            setNombre(profile[0].nombre ?? '');
            setApellido(profile[0].apellido ?? '');
            setEmail(profile[0].email ?? '');
            setPuesto(profile[0].puesto ?? '');
            setHorasSemana(String(profile[0].horas_semana));
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const supabase = createClient();

        const { error: errorUpdate } = await supabase
            .from('profiles')
            .update({ nombre: nombre, apellido: apellido, email: email, puesto: puesto, horas_semana: horasSemana })
            .eq('id', profile[0].id)

        if (errorUpdate) {
            console.log('Error updating Profile: ', errorUpdate);
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
                            <input type="text" value={horasSemana} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHorasSemana(e.target.value)}/>
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