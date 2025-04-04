import EntradasFichajes from '@/components/containers/historialFichajes/EntradasFichajes';
import ContainerOptions from '@/components/containers/ContainerOptions';

export default function Fichajes() {
  return (
    <>
      <ContainerOptions urlExportar={'#'}/>
      <EntradasFichajes date='Hoy'/>
      <EntradasFichajes date='Ayer'/>
      <EntradasFichajes date='09 de marzo de 2025'/>
    </>
  );
}