'use client'

import { useState } from "react";
import styles from './containerSuperior.module.css';
import ContainerDatos from "./datos/ContainerDatos";
import ContainerFichaje from "./fichaje/ContanerFichaje";
import { Fichaje_eventos, Fichaje_jornada, Profile } from "@/types/Types";


export default function ContainerSuperior({ profile, fichaje, eventos }: { profile: Profile[], fichaje: Fichaje_jornada[], eventos: Fichaje_eventos[] }) {
    const [estado, setEstado] = useState(profile[0].estado ?? '');
    const [localizacionFichaje, setLocalizacionFichaje] = useState(eventos?.[eventos.length - 1]?.localizacion ?? '');

    return (
        <div className={styles.containerSuperior}>
            <ContainerDatos estado={estado} localizacionFichaje={localizacionFichaje} setLocalizacionFichaje={setLocalizacionFichaje} horaInicio={fichaje[0]?.date || '-'} horaFinalAprox={fichaje[0]?.date_final_aprox || '-'} profile={profile}/>
            <ContainerFichaje profile={profile} estado={estado} setEstado={setEstado} localizacionFichaje={localizacionFichaje} />
        </div>
    );
}
