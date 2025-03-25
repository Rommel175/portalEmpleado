'use client'

import { useEffect, useState } from "react";
import styles from "./ContainerTimer.module.css";

export default function ContainerTimer() {

    const [time, setTime] = useState(0);
    const [isRunning, setRunning] = useState(false);

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

    return (
        <>
            <div className={styles.date}>
                <h3>11 de marzo de 2025</h3>
                <div className={styles.counter}>
                    <h2>00:00:00</h2>
                </div>
            </div>
            <div className={styles.buttons}>
                <button className={styles.entrada}>FICHAR ENTRADA</button>
                <button className={styles.pausa}>PAUSA</button>
                <button className={styles.salida}>SALIDA</button>
            </div>
        </>
    );
}