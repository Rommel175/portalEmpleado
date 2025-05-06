'use client'

import { useState } from "react";
import styles from './containerSuperior.module.css';
import ContainerDatos from "./datos/ContainerDatos";
import ContainerFichaje from "./fichaje/ContanerFichaje";
import { Fichaje_eventos, Fichaje_jornada, Profile } from "@/types/Types";


export default function ContainerSuperior({ profile, fichaje, eventos }: { profile: Profile, fichaje: Fichaje_jornada[], eventos: Fichaje_eventos[] }) {
    const [estado, setEstado] = useState(profile.estado ?? '');
    const [localizacionFichaje, setLocalizacionFichaje] = useState(eventos?.[eventos.length - 1]?.localizacion ?? 'oficina');
    const [horaInicio, setHoraInicio] = useState(fichaje?.[0]?.date ?? '');
    const [horaFinalAprox, setHoraFinalAprox] = useState(fichaje?.[0]?.date_final_aprox);
    //console.log(fichaje);

    return (
        <div className={styles.containerSuperior}>
            <ContainerDatos estado={estado} localizacionFichaje={localizacionFichaje} setLocalizacionFichaje={setLocalizacionFichaje} horaInicio={horaInicio} setHoraInicio={setHoraInicio} setHoraFinalAprox={setHoraFinalAprox} horaFinalAprox={horaFinalAprox} profile={profile}/>
            <ContainerFichaje profile={profile} estado={estado} setEstado={setEstado} localizacionFichaje={localizacionFichaje} />
        </div>
    );
}
