'use client'

import ContainerOptions from '@/components/containers/ContainerOptions';
import EntradaSolicitudes from '@/components/containers/historialSolicitudes/EntradaSolicitudes';
import { useState } from 'react';

export default function Solicitudes() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  const [reciente, setReciente] = useState(true);
  return (
    <>
      <ContainerOptions
        urlExportar={'#'}
        exportar={true}
        recientes={true}
        tipoRegistro={true}
        date={true}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        option={option}
        setOption={setOption}
        localizacion={localizacion}
        setLocalizacion={setLocalizacion}
        reciente={reciente}
        setReciente={setReciente}
      />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
      <EntradaSolicitudes />
    </>
  );
}