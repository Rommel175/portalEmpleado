import styles from './actividad.module.css';

type Props = {
    horas: string;
    total: number;
};


export default function ActividadCard({ horas, total }: Props) {
    function formatHora(horasStr: string): number {
        const [horas, minutos] = horasStr.split(':').map(Number);
        return horas + minutos / 60;
    }

    const horaDecimal = formatHora(horas);

    const porcentaje = Math.min((horaDecimal / total) * 100, 100);

    return (
        <div className={styles.container}>
            <h3>Actividad semanal</h3>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3>{horaDecimal.toFixed(2)} h</h3>
                    <div className={styles.horizontalBarContainer}>
                        <div className={styles.horizontalBar} style={{ width: `${porcentaje}%` }} />
                    </div>
                </div>

                <div className={styles.verticalBarContainer}>
                    <div className={styles.verticalBar} style={{ height: `${porcentaje}%` }} />
                </div>
            </div>
        </div>

    );
}
