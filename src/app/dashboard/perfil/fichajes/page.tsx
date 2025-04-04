import EntradasFichajes from '@/components/containers/historialFichajes/EntradasFichajes';

export default function Fichajes() {
  return (
    <>
      <EntradasFichajes date='Hoy'/>
      <EntradasFichajes date='Ayer'/>
      <EntradasFichajes date='09 de marzo de 2025'/>
    </>
  );
}