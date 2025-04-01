import styles from './fichajes.module.css'
import ContainerHeader from '@/components/containers/ContainerHeader'
import EntradasFichajes from '@/components/containers/historialFichajes/EntradasFichajes';
import OptionsFichajes from '@/components/containers/historialFichajes/OptionsFichajes';

export default function Fichajes() {
  return (
    <>
      <ContainerHeader name='Historial de Fichajes'/>
      <div className={styles.mainContent}>
        <OptionsFichajes />
        <EntradasFichajes date='Hoy'/>
        <EntradasFichajes date='Ayer'/>
        <EntradasFichajes date='09 de marzo de 2025'/>
      </div>
    </>
  );
}