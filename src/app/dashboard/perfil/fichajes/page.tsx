'use client'

import { useState, useEffect } from 'react';
import ContainerOptions from '@/components/containers/ContainerOptions';
import EntradasFichajes from '@/components/containers/historialFichajes/EntradasFichajes';
import styles from './fichajes.module.css'
import { Profile } from '@/types/Types';
import dayjs from 'dayjs';
import ActividadCardIndividual from '@/components/cards/ActividadIndividual';
import DropdownExportar from '@/components/customInputs/dropfownExportar/DropdownExportar';

type EventosPorFechaType = {
  fecha: string;
  eventos: Evento[];
};

type Evento = {
  id: number;
  fichaje_id: number;
  evento: string;
  date: Date;
  localizacion: string;
};

export default function Fichajes() {

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  const [reciente, setReciente] = useState(true);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const [tipoRegistros, setTipoRegistros] = useState('all');

  const [eventosPorFecha, setEventosPorFecha] = useState<EventosPorFechaType[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [totalHorasTrabajadas, setTotalHorasTrabajadas] = useState<string>('00:00');
  const [totalHoras, setTotalHoras] = useState(0);

  useEffect(() => {
    let start = startDate;
    let end = endDate;


    if (!startDate || !endDate) {
      const now = dayjs();

      start = now.day(1).startOf('day').toDate();
      end = now.day(1).add(5, 'day').endOf('day').toDate();

      setStartDate(start);
      setEndDate(end);
    }

    const fetchData = async () => {

      const params = new URLSearchParams({
        option: option,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
        reciente: reciente ? 'true' : 'false',
        localizacion: localizacion,
        tipoRegistro: tipoRegistros
      });


      const res = await fetch(`/api/fichajes?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        console.error('Error en la respuesta:', res.status);
        return;
      }

      const result = await res.json();

      if (result.success) {
        setEventosPorFecha(result.data)
        setProfile(result.profile)
        setTotalHoras(result.horas_semana);
      }
    }

    fetchData();
  }, [option, localizacion, reciente, tipoRegistros])

  return (
    <>
      {profile && (
        <ActividadCardIndividual
          totalHoras={totalHoras}
          setTotalHorasTrabajadas={setTotalHorasTrabajadas}
          totalHorasTrabajadas={totalHorasTrabajadas}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          localizacion={localizacion}
          setLocalizacion={setLocalizacion}
          option={option}
          setOption={setOption}
          id={profile.id}
        />
      )}
      <div className={styles.options}>
        <DropdownExportar eventos={eventosPorFecha} startDate={startDate} endDate={endDate}/>

        <ContainerOptions
          recientes={true}
          tipoRegistro={true}
          ubicacion={true}
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
          checkedState={checkedState}
          setCheckedState={setCheckedState}
          tipoRegistros={tipoRegistros}
          setTipoRegistros={setTipoRegistros}
        />
      </div>

      {
        eventosPorFecha.length == 0 ? (
          <p>No hay registros.</p>
        ) : (

          eventosPorFecha.map((item) => (
            <EntradasFichajes
              key={item.fecha}
              date={item.fecha}
              eventos={item.eventos}
            />
          ))
        )
      }

    </>
  );
}
