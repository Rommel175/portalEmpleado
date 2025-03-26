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

            <div className={styles.modify}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6549 3.14443C14.245 2.71414 13.6891 2.47241 13.1095 2.47241C12.5299 2.47241 11.974 2.71414 11.5641 3.14443L3.83468 11.2613C3.60927 11.4978 3.45375 11.7977 3.38682 12.1248L2.79101 15.0438C2.7753 15.1204 2.77813 15.2 2.79925 15.2752C2.82037 15.3504 2.85911 15.4189 2.91192 15.4743C2.96473 15.5298 3.02993 15.5705 3.10157 15.5926C3.17321 15.6148 3.24899 15.6178 3.32201 15.6013L6.10215 14.9757C6.41371 14.9055 6.6993 14.7422 6.92457 14.5055L14.6549 6.38911C15.0646 5.95878 15.2947 5.37523 15.2947 4.76677C15.2947 4.15832 15.0646 3.57477 14.6549 3.14443ZM12.1966 3.80801C12.4409 3.56534 12.7659 3.43234 13.1022 3.43729C13.4386 3.44224 13.7598 3.58475 13.9976 3.83451C14.2354 4.08428 14.3711 4.42159 14.3757 4.77474C14.3804 5.12788 14.2536 5.46899 14.0224 5.72553L13.6201 6.1479L11.7938 4.23084L12.1966 3.80801ZM11.1614 4.89442L12.9877 6.81194L6.293 13.8424C6.18941 13.9511 6.05809 14.0261 5.91487 14.0583L3.8092 14.5322L4.26064 12.3219C4.2913 12.1715 4.3627 12.0336 4.46624 11.9249L11.1614 4.89442Z" fill="#0B3C70" />
                </svg>
                <p>Solicitar modificación</p>
            </div>

        </div>
    );
}