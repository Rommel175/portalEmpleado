import styles from './mainContent.module.css';

export default function MainContentComponent() {
    return (
        <div className={styles.mainContent}>
            <div className={styles.option}>
                <h4>Estado</h4>
                <div className={styles.state}>
                    <p>Activo</p>
                </div>
            </div>

            <div className={styles.option}>
                <h4>Localización</h4>
                <select name="localizacion" id="localizacion" className={styles.location}>
                    <option value="0">Oficina</option>
                    <option value="1">Casa</option>
                    <option value="2">Viaje</option>
                </select>
            </div>

            <div className={styles.option}>
                <h4>Inicio Jornada</h4>
                <div className={styles.day}>
                    <p>08:27</p>
                </div>
            </div>

            <div className={styles.option}>
                <h4>Final Jornada</h4>
                <div className={styles.day}>
                    <p>18:33</p>
                </div>
            </div>
            
        </div>
    );
}