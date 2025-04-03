'use client'

import { useEffect, useState } from "react";
import styles from "./ContainerTimer.module.css";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export default function ContainerTimer( { user }: {user:User} ) {
    const [time, setTime] = useState<number>(0);
    const [isRunning, setRunning] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<string>("");
    const supabase = createClient();

    useEffect(() => {
        const date = new Date();
        const formatDate = new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }).format(date)

        setCurrentDate(formatDate)
    }, [])

    function startTimer() {
        setRunning(true);
    }

    function pauseTimer() {
        setRunning(false);
    }

    async function salida() {
        const date3 = new Date();
        const day = String(date3.getDate()).padStart(2, '0');
        const mounth = String(date3.getMonth() + 1).padStart(2, '0');
        const year = date3.getFullYear();

        const { data, error } = await supabase
            .from('historialFichajes')
            .select('id')
            .eq('created_at', `${year}-${mounth}-${day}`)
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching fichaje state:', error);
            return;
        }

        console.log(data);

        if (data && data.length > 0) {
            const fichajeId = data[0].id;
            console.log(fichajeId)
        
            const { error: updateError } = await supabase
                .from('historialFichajes')
                .update({estado: 'inactivo'})  
                .eq('id', fichajeId); 
        
            if (updateError) {
                console.error('Error updating fichaje:', updateError);
                return;
            }
        
        }
    }

    function stopTimer() {
        setRunning(false);
        setTime(0);
        salida();
    }

    useEffect(() => {
        if (!isRunning) return;
        const timer: number = window.setInterval(() => {
            setTime(prevTime => {
                const newTime = prevTime + 1;
                return newTime;
            });
        }, 1000)

        return () => clearInterval(timer);
    }, [isRunning])

    function formatTimer(s: number) {
        const hours = String(Math.floor(s / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
        const seconds = String(s % 60).padStart(2, "0");

        return `${hours}:${minutes}:${seconds}`
    }


    return (
        <>
            <div className={styles.date}>
                <h3>{currentDate}</h3>
                <div className={styles.counter}>
                    <h2>{formatTimer(time)}</h2>
                </div>
            </div>
            <div className={styles.buttons}>
                <button className={styles.entrada} onClick={startTimer}>FICHAR ENTRADA</button>
                <button className={styles.pausa} onClick={pauseTimer}>PAUSA</button>
                <button className={styles.salida} onClick={stopTimer}>FICHAR SALIDA</button>
            </div>
        </>
    );
}