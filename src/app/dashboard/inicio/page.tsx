import NavHomePage from '@/components/inicio/NavInicio';
import styles from './inicio.module.css';
import ContainerDatos from '@/components/inicio/containers/datos/ContainerDatos';
import ContainerFichaje from '@/components/inicio/containers/fichaje/ContainerFichaje';


export default function HomePage() {
  return (
    <div className={styles.wraper}>
      <NavHomePage />
      <section className={styles.containers}>
        <ContainerDatos />

        <ContainerFichaje />
      </section>
    </div>
  );
}