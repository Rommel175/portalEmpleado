import styles from './containerEquipo.module.css'
import ContainerTable from './ContainerTable';
import { Equipo } from '@/types/Types';

export default function ContainerEquipo({ equipo }: { equipo: Equipo[] }) {

    return (
        <div className={styles.container}>
            <h3>Equipo</h3>
            <ContainerTable equipo={equipo} />
        </div>
    );
}