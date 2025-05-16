'use client'

import styles from './modal.module.css'
import { useState, useEffect } from "react";
import Image from 'next/image';
import { Profile } from '@/types/Types';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Tooltips from '../tooltip/Tooltips';
import CustomSelect from '../customInputs/customSelect/CustomSelect';

export default function Modal({ profile }: { profile: Profile }) {
    const [isOpen, setIsOpen] = useState(true);
    const [currentDate, setCurrentDate] = useState<string>("");
    const [currentTime, setCurrentTime] = useState<string>("");
    const [localizacionFichaje, setLocalizacionFichaje] = useState('oficina');
    const [horaFinalAprox, setHoraFinalAprox] = useState<Date | null>(null);
    const [horaFinalAproxVisualizer, setHoraFinalAproxVisualizer] = useState('');
    const [mensaje, setMensaje] = useState('');
    useEffect(() => {
        dayjs.locale('es');

        const date = dayjs();

        setCurrentDate(date.format("DD [de] MMMM [de] YYYY"));
        setCurrentTime(date.format("HH:mm"));

        const horasTrabajo = profile.horas_semana / 5;

        const horaFinal = date.add(horasTrabajo, 'hour');
        setHoraFinalAprox(horaFinal.toDate());
        setHoraFinalAproxVisualizer(horaFinal.format('HH:mm'));
    }, []);

    async function fichar() {
        await fetch('/api/fichar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                profileId: profile.id,
                comentario: mensaje,
                horaFinalAprox,
                localizacion: localizacionFichaje
            })
        })
    }

    function handleClose() {
        setIsOpen(false);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsOpen(false);
        fichar();
    }

    function handleChangeMensaje(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setMensaje(e.target.value)
    }

    return (

        (profile.alta && isOpen && !profile.is_admin && (profile.estado == 'Inactivo' || profile.estado == 'Jornada Finalizada')) &&
        <div className={styles.overlay}>

            <div className={styles.modalContainer}>
                <form className={styles.form} onSubmit={handleSubmit} >
                    <header className={styles.formHeader}>
                        <h1>!Hola {profile.nombre}!</h1>
                        <h2>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui ad quisquam consequatur maiores suscipit voluptatum necessitatibus placeat molestias nulla incidunt dolor dolores fugit, odit assumenda reiciendis ipsum culpa alias. Ex!</h2>
                    </header>

                    <div className={styles.formGroup}>
                        <div className={styles.date}>
                            <div className={styles.dateItem}>
                                <label htmlFor="date">Fecha</label>
                                <input type="text" name='date' defaultValue={currentDate} readOnly />
                            </div>
                            <div className={styles.dateItem}>
                                <label htmlFor="hour">Hora</label>
                                <input type="text" name='hour' defaultValue={currentTime} readOnly />
                            </div>
                        </div>

                        <div className={styles.location}>
                            <label htmlFor="location">Localización</label>
                            <CustomSelect localizacionFichaje={localizacionFichaje} setLocalizacionFichaje={setLocalizacionFichaje} options={["Oficina", "Casa", "Viaje"]} />
                        </div>

                        <div className={styles.departureTime}>
                            <label htmlFor="departureTime">
                                Hora prevista Final de Jornada
                                <Tooltips infoText='Esta es la hora prevista a la que terminas tu jornada laboral. Puedes modificar esto desde tu perfil'>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.97506 9C6.15006 9 6.29806 8.9395 6.41906 8.8185C6.54006 8.6975 6.60039 8.54967 6.60006 8.375C6.59973 8.20034 6.53939 8.05234 6.41906 7.931C6.29873 7.80967 6.15073 7.74934 5.97506 7.75C5.79939 7.75067 5.65156 7.81117 5.53156 7.9315C5.41156 8.05184 5.35106 8.19967 5.35006 8.375C5.34906 8.55034 5.40956 8.69834 5.53156 8.819C5.65356 8.93967 5.80139 9 5.97506 9ZM5.52506 7.075H6.45006C6.45006 6.8 6.48139 6.58334 6.54406 6.425C6.60673 6.26667 6.78373 6.05 7.07506 5.775C7.29173 5.55834 7.46256 5.352 7.58756 5.156C7.71256 4.96 7.77506 4.72467 7.77506 4.45C7.77506 3.98334 7.60423 3.625 7.26256 3.375C6.92089 3.125 6.51673 3 6.05006 3C5.57506 3 5.18973 3.125 4.89406 3.375C4.5984 3.625 4.39206 3.925 4.27506 4.275L5.10006 4.6C5.14173 4.45 5.23556 4.2875 5.38156 4.1125C5.52756 3.9375 5.75039 3.85 6.05006 3.85C6.31673 3.85 6.51673 3.923 6.65006 4.069C6.78339 4.215 6.85006 4.37534 6.85006 4.55C6.85006 4.71667 6.80006 4.873 6.70006 5.019C6.60006 5.165 6.47506 5.30034 6.32506 5.425C5.95839 5.75 5.7334 5.99584 5.65006 6.1625C5.56673 6.32917 5.52506 6.63334 5.52506 7.075ZM6.00006 11C5.30839 11 4.6584 10.8688 4.05006 10.6065C3.44173 10.3442 2.91256 9.98784 2.46256 9.5375C2.01256 9.08717 1.6564 8.558 1.39406 7.95C1.13173 7.342 1.0004 6.692 1.00006 6C0.999728 5.308 1.13106 4.658 1.39406 4.05C1.65706 3.442 2.01323 2.91284 2.46256 2.4625C2.9119 2.01217 3.44106 1.656 4.05006 1.394C4.65906 1.132 5.30906 1.00067 6.00006 1C6.69106 0.999336 7.34106 1.13067 7.95006 1.394C8.55906 1.65734 9.08823 2.0135 9.53756 2.4625C9.9869 2.9115 10.3432 3.44067 10.6066 4.05C10.8699 4.65934 11.0011 5.30934 11.0001 6C10.9991 6.69067 10.8677 7.34067 10.6061 7.95C10.3444 8.55934 9.98823 9.0885 9.53756 9.5375C9.0869 9.9865 8.55773 10.3428 7.95006 10.6065C7.34239 10.8702 6.69239 11.0013 6.00006 11Z" fill="#285FF5" />
                                    </svg>
                                </Tooltips>
                            </label>
                            <input type="text" defaultValue={horaFinalAproxVisualizer} readOnly />
                        </div>

                        <div className={styles.note}>
                            <label htmlFor="note">
                                Notas
                                <Tooltips infoText='Este campo es opcional, pero si quieres puedes dejar un comentario sobre tu fichaje'>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.97506 9C6.15006 9 6.29806 8.9395 6.41906 8.8185C6.54006 8.6975 6.60039 8.54967 6.60006 8.375C6.59973 8.20034 6.53939 8.05234 6.41906 7.931C6.29873 7.80967 6.15073 7.74934 5.97506 7.75C5.79939 7.75067 5.65156 7.81117 5.53156 7.9315C5.41156 8.05184 5.35106 8.19967 5.35006 8.375C5.34906 8.55034 5.40956 8.69834 5.53156 8.819C5.65356 8.93967 5.80139 9 5.97506 9ZM5.52506 7.075H6.45006C6.45006 6.8 6.48139 6.58334 6.54406 6.425C6.60673 6.26667 6.78373 6.05 7.07506 5.775C7.29173 5.55834 7.46256 5.352 7.58756 5.156C7.71256 4.96 7.77506 4.72467 7.77506 4.45C7.77506 3.98334 7.60423 3.625 7.26256 3.375C6.92089 3.125 6.51673 3 6.05006 3C5.57506 3 5.18973 3.125 4.89406 3.375C4.5984 3.625 4.39206 3.925 4.27506 4.275L5.10006 4.6C5.14173 4.45 5.23556 4.2875 5.38156 4.1125C5.52756 3.9375 5.75039 3.85 6.05006 3.85C6.31673 3.85 6.51673 3.923 6.65006 4.069C6.78339 4.215 6.85006 4.37534 6.85006 4.55C6.85006 4.71667 6.80006 4.873 6.70006 5.019C6.60006 5.165 6.47506 5.30034 6.32506 5.425C5.95839 5.75 5.7334 5.99584 5.65006 6.1625C5.56673 6.32917 5.52506 6.63334 5.52506 7.075ZM6.00006 11C5.30839 11 4.6584 10.8688 4.05006 10.6065C3.44173 10.3442 2.91256 9.98784 2.46256 9.5375C2.01256 9.08717 1.6564 8.558 1.39406 7.95C1.13173 7.342 1.0004 6.692 1.00006 6C0.999728 5.308 1.13106 4.658 1.39406 4.05C1.65706 3.442 2.01323 2.91284 2.46256 2.4625C2.9119 2.01217 3.44106 1.656 4.05006 1.394C4.65906 1.132 5.30906 1.00067 6.00006 1C6.69106 0.999336 7.34106 1.13067 7.95006 1.394C8.55906 1.65734 9.08823 2.0135 9.53756 2.4625C9.9869 2.9115 10.3432 3.44067 10.6066 4.05C10.8699 4.65934 11.0011 5.30934 11.0001 6C10.9991 6.69067 10.8677 7.34067 10.6061 7.95C10.3444 8.55934 9.98823 9.0885 9.53756 9.5375C9.0869 9.9865 8.55773 10.3428 7.95006 10.6065C7.34239 10.8702 6.69239 11.0013 6.00006 11Z" fill="#285FF5" />
                                    </svg>
                                </Tooltips>
                            </label>
                            <textarea name="note" placeholder='Escribe aquí tu texto...' value={mensaje} onChange={handleChangeMensaje}></textarea>
                        </div>

                        <div className={styles.buttons}>
                            <button type='button' onClick={handleClose}>Saltar fichajes</button>
                            <button type='submit'>Fichar</button>
                        </div>
                    </div>

                </form>
                <Image src={'/images/modal_image.jpg'} width={542} height={756} alt='img' />
            </div>
        </div>
    )
}