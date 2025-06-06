'use client'

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styles from './formularioAdd.module.css';
import SnackbarSuccess from "@/components/snackbar/createUser/success/SnackbarSuccess";
import SnackbarError from "@/components/snackbar/createUser/error/SnackbarError";

export default function FormularioAdd() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState({
        value: '',
        hasError: false
    });
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
    //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function handleHoraChange(e: React.ChangeEvent<HTMLInputElement>, setHora: React.Dispatch<React.SetStateAction<{ value: string; hasError: boolean }>>) {
        setHora({ value: e.target.value, hasError: false });
    }

    function handleHoraBlur(hora: { value: string; hasError: boolean }, setHora: React.Dispatch<React.SetStateAction<{ value: string; hasError: boolean }>>) {
        const hasError = hora.value !== '' && !hourRegexp.test(hora.value);
        setHora((prev) => ({ ...prev, hasError }))
    }

    function handleChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail({ value: e.target.value, hasError: false })
    }

    function handleEmailBlur() {
        const cleaned = email.value.trim().toLowerCase();
        const hasError = !(
            cleaned.endsWith('@xanasystem.com') ||
            cleaned === 'example.xana@gmail.com' ||
            cleaned === 'rommel.xana@gmail.com' ||
            cleaned.endsWith('@xanatechnologies.com') ||
            cleaned === 'rrommel5@gmail.com'
        );
        setEmail((prev) => ({ ...prev, hasError }));
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

    function resetForm() {
        setNombre('');
        setApellido('');
        setEmail({ value: '', hasError: false });
        setPuesto('');
        setHorasSemana(String(''));
        //setEmailPersonal('');
        setTelefono('');
        setTelefonoPersonal('');
        setCoste('');
        setDiasVacaciones('');
        setHoraLunes({ value: parseHora(''), hasError: false });
        setHoraMartes({ value: parseHora(''), hasError: false });
        setHoraMiercoles({ value: parseHora(''), hasError: false });
        setHoraJueves({ value: parseHora(''), hasError: false });
        setHoraViernes({ value: parseHora(''), hasError: false });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const isHoraValidaLunes = hourRegexp.test(horaLunes.value) || horaLunes.value === "";
        const isHoraValidaMartes = hourRegexp.test(horaMartes.value) || horaMartes.value === "";
        const isHoraValidaMiercoles = hourRegexp.test(horaMiercoles.value) || horaMiercoles.value === "";
        const isHoraValidaJueves = hourRegexp.test(horaJueves.value) || horaJueves.value === "";
        const isHoraValidaViernes = hourRegexp.test(horaViernes.value) || horaViernes.value === "";
        const trimmedEmail = email.value.trim().toLowerCase();
        const isEmailValid =
            trimmedEmail.endsWith('@xanasystem.com') ||
            trimmedEmail === 'example.xana@gmail.com' ||
            trimmedEmail === 'rommel.xana@gmail.com' ||
            trimmedEmail.endsWith('@xanatechnologies.com') ||
            trimmedEmail === 'rrommel5@gmail.com';

        if (!isEmailValid) {
            setEmail((prev) => ({ ...prev, hasError: true }));
            return;
        }

        if (!isHoraValidaLunes) {
            setHoraLunes((prev) => ({ ...prev, hasError: true }));
            return;
        }

        if (!isHoraValidaMartes) {
            setHoraMartes((prev) => ({ ...prev, hasError: true }));
            return;
        }

        if (!isHoraValidaMiercoles) {
            setHoraMiercoles((prev) => ({ ...prev, hasError: true }));
            return;
        }

        if (!isHoraValidaJueves) {
            setHoraJueves((prev) => ({ ...prev, hasError: true }));
            return;
        }

        if (!isHoraValidaViernes) {
            setHoraViernes((prev) => ({ ...prev, hasError: true }));
            return;
        }

        const res = await fetch('/api/gestion/addUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                email: email.value,
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
            setMessage('Ha ocurrido un error en la creación del perfil.')
            return;
        }

        const result = await res.json();

        if (result.success) {
            setSnackbarSuccess(true);
            setMessage('El usuario ha sido creado correctamente.');
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
                {
                    /*
                    <div className={styles.profile}>
                        <Image src={profile.image} width={60} height={60} alt="img" />
                    </div>
                    */
                }

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
                            <input type="email" value={email.value} onChange={handleChangeEmail} onBlur={handleEmailBlur} />
                            {
                                (email.hasError) &&
                                <span style={{ color: 'red' }}>No es una email corporativo</span>
                            }
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

                <div className={styles.buttons}>
                    <input type="button" onClick={resetForm} value="Cancelar" />
                    <input type="submit" value="Añair usuario" />
                </div>
            </form>
        </>

    );
}