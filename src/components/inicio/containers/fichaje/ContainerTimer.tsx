'use client'

import { useEffect, useState } from "react";
import styles from "./ContainerTimer.module.css";

export default function ContainerTimer() {
    const [time, setTime] = useState<number>(0);
    const [isRunning, setRunning] = useState<boolean>(false);

    function startTimer() {
        setRunning(true);
    }

    function pauseTimer() {
        setRunning(false);
    }

    function stopTimer() {
        setRunning(false);
        setTime(0);
    }

    useEffect(() => {
        if (!isRunning) return;
        const timer: number = window.setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000)

        return () => clearInterval(timer);
    },[isRunning])

    function formatTimer(s: number) {
        const hours = String(Math.floor(s / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
        const seconds = String(s % 60).padStart(2, "0");
        
        return `${hours}:${minutes}:${seconds}`
    }

    return (
        <>
            <div className={styles.date}>
                <h3>11 de marzo de 2025</h3>
                <div className={styles.counter}>
                    <h2>{formatTimer(time)}</h2>
                </div>
            </div>
            <div className={styles.buttons}>
                <button className={styles.entrada} onClick={startTimer}>FICHAR ENTRADA</button>
                <button className={styles.pausa} onClick={pauseTimer}>PAUSA</button>
                <button className={styles.salida} onClick={stopTimer}>SALIDA</button>
            </div>
        </>
    );
}