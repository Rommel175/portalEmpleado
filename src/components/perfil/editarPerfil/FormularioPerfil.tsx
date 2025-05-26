'use client'

import { Profile } from '@/types/Types';
import styles from './formularioPerfil.module.css';
import { useEffect, useState } from 'react';
//import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import dayjs from 'dayjs';
import SnackbarSuccess from '@/components/snackbar/editarPerfil/success/SnackbarSuccess';
import SnackbarError from '@/components/snackbar/editarPerfil/error/SnackbarError';
import { useRouter } from 'next/navigation';

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
    //snackbars
    const [snackbarSuccess, setSnackbarSuccess] = useState(false);
    const [snackbarError, setSnackbarError] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (snackbarSuccess) {
            const timer = setTimeout(() => {
                setSnackbarSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbarSuccess]);

    useEffect(() => {
        if (snackbarError) {
            const timer = setTimeout(() => {
                setSnackbarError(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbarError]);


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

        const res = await fetch('/api/profile/update', {
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

        if (!res.ok) {
            console.error('Error en la respuesta:', res.status);
            setSnackbarError(true);
            setMessage('Ha ocurrido un error en la actualización del perfil.')
            return;
        }

        const result = await res.json();

        if (result.success) {
            setSnackbarSuccess(true);
            setMessage('El perfil ha sido actualizado con éxito.');
        }
    }

    async function handleDeleteUser() {
        const res = await fetch('/api/profile/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: profile.id }),
        });

        const data = await res.json();

        if (data.success) {
            setSnackbarSuccess(false);
            setSnackbarError(false);
            setMessage('');
            router.push('/dashboard/recursos/gestion')
        } else {
            setSnackbarSuccess(false);
            setSnackbarError(false);
            setMessage('');
            console.log('Error al eliminar el usuario')
        }
    }



    return (
        <>
            {
                (snackbarSuccess) &&
                <SnackbarSuccess setSnackbarSuccess={setSnackbarSuccess} message={message} />
            }

            {
                (snackbarError) &&
                <SnackbarError setSnackbarError={setSnackbarError} message={message} />
            }

            <form className={styles.wraper} onSubmit={handleSubmit}>
                <div className={styles.profile}>
                    <Image src={profile.image || '/images/default.jpg'} width={60} height={60} alt="img" />
                    {
                        (isAdmin) &&

                        <button type="button" className={styles.eliminarUser} onClick={handleDeleteUser}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.35015 4.70392H11.6498C11.6498 4.27417 11.476 3.86202 11.1666 3.55815C10.8572 3.25427 10.4375 3.08355 9.99998 3.08355C9.56242 3.08355 9.14278 3.25427 8.83337 3.55815C8.52397 3.86202 8.35015 4.27417 8.35015 4.70392ZM7.36025 4.70392C7.36025 4.01632 7.63836 3.35689 8.13341 2.87068C8.62846 2.38448 9.29988 2.11133 9.99998 2.11133C10.7001 2.11133 11.3715 2.38448 11.8666 2.87068C12.3616 3.35689 12.6397 4.01632 12.6397 4.70392H16.7643C16.8956 4.70392 17.0215 4.75514 17.1143 4.8463C17.2071 4.93746 17.2592 5.06111 17.2592 5.19003C17.2592 5.31896 17.2071 5.4426 17.1143 5.53376C17.0215 5.62493 16.8956 5.67614 16.7643 5.67614H15.8998L15.0966 15.1411C15.0382 15.8296 14.7185 16.4714 14.2008 16.9393C13.6831 17.4071 13.0053 17.6668 12.3018 17.6669H7.69814C6.99464 17.6668 6.31686 17.4071 5.79918 16.9393C5.28151 16.4714 4.96175 15.8296 4.90332 15.1411L4.10018 5.67614H3.23567C3.1044 5.67614 2.97851 5.62493 2.88569 5.53376C2.79287 5.4426 2.74072 5.31896 2.74072 5.19003C2.74072 5.06111 2.79287 4.93746 2.88569 4.8463C2.97851 4.75514 3.1044 4.70392 3.23567 4.70392H7.36025ZM5.88992 15.06C5.92766 15.5056 6.13451 15.9209 6.46944 16.2237C6.80437 16.5265 7.24293 16.6946 7.69814 16.6947H12.3018C12.757 16.6946 13.1956 16.5265 13.5305 16.2237C13.8655 15.9209 14.0723 15.5056 14.11 15.06L14.9072 5.67614H5.09338L5.88992 15.06ZM8.51513 7.94466C8.6464 7.94466 8.77229 7.99588 8.86512 8.08704C8.95794 8.1782 9.01008 8.30185 9.01008 8.43077V13.94C9.01008 14.069 8.95794 14.1926 8.86512 14.2838C8.77229 14.3749 8.6464 14.4261 8.51513 14.4261C8.38386 14.4261 8.25797 14.3749 8.16515 14.2838C8.07233 14.1926 8.02018 14.069 8.02018 13.94V8.43077C8.02018 8.30185 8.07233 8.1782 8.16515 8.08704C8.25797 7.99588 8.38386 7.94466 8.51513 7.94466ZM11.9798 8.43077C11.9798 8.30185 11.9276 8.1782 11.8348 8.08704C11.742 7.99588 11.6161 7.94466 11.4848 7.94466C11.3536 7.94466 11.2277 7.99588 11.1348 8.08704C11.042 8.1782 10.9899 8.30185 10.9899 8.43077V13.94C10.9899 14.069 11.042 14.1926 11.1348 14.2838C11.2277 14.3749 11.3536 14.4261 11.4848 14.4261C11.6161 14.4261 11.742 14.3749 11.8348 14.2838C11.9276 14.1926 11.9798 14.069 11.9798 13.94V8.43077Z" fill="#E72D2C" stroke="#E72D2C" strokeWidth="0.216286" />
                            </svg>
                            Eliminar usuario
                        </button>}
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
                            <h3>Hora de finalización del miércoles</h3>
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
                                    <input type="text" value={(horasSemana !== null && horasSemana !== 'null') ? String(horasSemana) : ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHorasSemana(e.target.value)} />
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
        </>

    );
}