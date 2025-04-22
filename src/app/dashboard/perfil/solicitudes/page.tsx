import ContainerOptions from '@/components/containers/ContainerOptions';
import EntradaSolicitudes from '@/components/containers/historialSolicitudes/EntradaSolicitudes';

export default function Solicitudes() {
  return (
    <>
      <ContainerOptions ubicacion={false} urlExportar={'#'} usuarios={false} añadirUsuario={false} />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
    </>
  );
}