import ContainerOptions from '@/components/containers/ContainerOptions';
import EntradaSolicitudes from '@/components/containers/historialSolicitudes/EntradaSolicitudes';

export default function Solicitudes() {
  return (
    <>
      <ContainerOptions ubicacion={false} urlExportar={'#'}/>
      <EntradaSolicitudes />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
    </>
  );
}