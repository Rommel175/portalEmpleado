'use client'

import ContainerOptions from '@/components/containers/ContainerOptions';
import EntradaSolicitudes from '@/components/containers/historialSolicitudes/EntradaSolicitudes';
import { useState } from 'react';

export default function Solicitudes() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  return (
    <>
      <ContainerOptions ubicacion={false}
        urlExportar={'#'}
        usuarios={false}
        añadirUsuario={false}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        option={option}
        setOption={setOption}
        localizacion={localizacion}
        setLocalizacion={setLocalizacion} />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
    </>
  );
}