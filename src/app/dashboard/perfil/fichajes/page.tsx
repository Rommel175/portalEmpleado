import ContainerHeader from '@/components/perfil/containerHeader';
import styles from './fichajes.module.css'
import OptionsFichajes from '@/components/perfil/fichajes/OptionsFichajes';
import EntradasFichajes from '@/components/perfil/fichajes/EntradasFichajes';

export default function Fichajes() {
  return (
    <>
      <ContainerHeader title='Historial de Fichajes' />
      <div className={styles.mainContent}>
        <OptionsFichajes />
        <EntradasFichajes date='Hoy'/>
        <EntradasFichajes date='Ayer'/>
        <EntradasFichajes date='09 de marzo de 2025'/>
      </div>
    </>
  );
}