'use client'

import { useEffect, useState } from "react";
import styles from "./ContainerTimer.module.css";

export default function ContainerTimer() {
    const [time, setTime] = useState<number>(0);
    const [isRunning, setRunning] = useState<boolean>(false);
    const [currentDate, setCurrentDate] = useState<string>("");

    useEffect(() => {
        const date = new Date();
        const formatDate = new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }).format(date)
        
        setCurrentDate(formatDate)
    }, [])

    /*useEffect(() => {
        const item = localStorage.getItem("timer-time");
        if (item) {
            setTime(Number(item))
        }

        const stateRunning = localStorage.getItem('timer-running');

        if (stateRunning == 'true') {
            setRunning(true);
        }
        
    }, [])*/

    function startTimer() {
        setRunning(true);
        //localStorage.setItem('timer-running', "true")
    }

    function pauseTimer() {
        setRunning(false);
        //localStorage.setItem('timer-running', "false")
    }

    function stopTimer() {
        setRunning(false);
        setTime(0);
        //localStorage.clear();
    }

    useEffect(() => {
        if (!isRunning) return;
        const timer: number = window.setInterval(() => {
            setTime(prevTime => {
                const newTime = prevTime + 1;
                //localStorage.setItem('timer-time', String(newTime));
                return newTime;
            });
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