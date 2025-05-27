'use client'

import styles from './fichajesInformes.module.css'
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Fichaje_eventos } from '@/types/Types';
import ContainerOptions from "@/components/containers/ContainerOptions";
import DropdownExportarProfile from "@/components/customInputs/dropdownExportar/exportarProfile/DropdownExportarProfile";
import EntradasFichajes from '@/components/containers/historialFichajes/EntradasFichajes';

type EventosPorFechaType = {
  fecha: string;
  eventos: Evento[];
};

type Evento = {
  id: number,
  fichaje_id: number,
  evento: string,
  modificado: boolean,
  dateOriginal: Date,
  dateModificada: Date,
  dateCalculos: Date,
  localizacion: string,
  id_modificacion: string
};

export default function FichajesInformes({ params }: { params: Promise<{ id: string }> }) {

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  const [reciente, setReciente] = useState(true);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const [checkedStateRegistro, setCheckedStateRegistro] = useState<{ [key: string]: boolean }>({});
  const [registroSelected, setRegistroSelected] = useState(0);
  const [activarFiltros, setActivarFiltros] = useState(0);
  const [borrarFiltros, setBorrarFiltros] = useState(0);
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    option: 'Esta semana',
    localizacion: 'all',
    reciente: true,
    checkedStateRegistro: {},
  });

  const [eventosPorFecha, setEventosPorFecha] = useState<EventosPorFechaType[]>([]);
  //const [profile, setProfile] = useState<Profile | null>(null);
  //const [totalHorasTrabajadas, setTotalHorasTrabajadas] = useState<string>('00:00');
  //const [totalHoras, setTotalHoras] = useState(0);
  const [checkedStateFichaje, setCheckedStateFichaje] = useState<{ [key: string]: boolean }>({});
  const isSelected = Object.values(checkedStateFichaje).some((val) => val === true);

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
      const { id } = await params;

      const urlParams = new URLSearchParams({
        option: option,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
        reciente: reciente ? 'true' : 'false',
        localizacion: localizacion,
        profileId: id,
        checkedStateRegistro: JSON.stringify(checkedStateRegistro)
      });

      const res = await fetch(`/api/fichajes/dinamico?${urlParams.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        console.error('Error en la respuesta:', res.status);
        return;
      }

      const result = await res.json();

      if (result.success) {
        setEventosPorFecha(result.data);
        const eventos = result.data.flatMap((item: EventosPorFechaType) => item.eventos);
        const initialState = Object.fromEntries(eventos.map((evento: Fichaje_eventos) => [evento.id, false]));
        setCheckedStateFichaje(initialState);

        //setProfile(result.profile)
        //setTotalHoras(result.horas_semana);
        //console.log(eventos);
      }
    };

    fetchData();
  }, [activarFiltros, borrarFiltros]);

  useEffect(() => {
    const countSelected = Object.values(checkedStateRegistro).filter((val) => val === true).length;
    setRegistroSelected(countSelected);
  }, [checkedStateRegistro]);

  function resetFiltros() {
    setReciente(true);
    setOption('Esta semana');
    setLocalizacion('all');
    setCheckedStateRegistro({});
    setBorrarFiltros(prev => prev + 1)
  }

  function activarFiltrosHandler() {
    setActivarFiltros(prev => prev + 1);
    setFiltrosAplicados({
      option,
      localizacion,
      reciente,
      checkedStateRegistro,
    });
  };

  const hayCambiosEnFiltros = (
    option !== filtrosAplicados.option ||
    localizacion !== filtrosAplicados.localizacion ||
    reciente !== filtrosAplicados.reciente ||
    JSON.stringify(checkedStateRegistro) !== JSON.stringify(filtrosAplicados.checkedStateRegistro)
  );

  return (
    <>
      <div className={styles.options}>
        <DropdownExportarProfile eventos={eventosPorFecha} startDate={startDate} endDate={endDate} checkedStateFichajes={checkedStateFichaje} isSelected={isSelected} />

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
          setCheckedStateRegistro={setCheckedStateRegistro}
          checkedStateRegistro={checkedStateRegistro}
          totalRegistros={registroSelected}
        >
          <div className={styles.buttons}>
            <button
              className={styles.filtroBtn}
              disabled={!hayCambiosEnFiltros}
              onClick={activarFiltrosHandler}
            >
              Activar Filtros
            </button>
            <div className={styles.borrarFiltros} onClick={resetFiltros}>
              Borrar Filtros
            </div>
          </div>
        </ContainerOptions>
      </div>

      {
        eventosPorFecha.length == 0 ? (
          <p>No hay registros.</p>
        ) : (
          eventosPorFecha.map((item) => (
            <EntradasFichajes
              key={item.fecha}
              dateJoranda={item.fecha}
              eventos={item.eventos}
              checkedStateFichajes={checkedStateFichaje}
              setCheckedStateFichaje={setCheckedStateFichaje}
            />
          ))
        )
      }
    </>
  );
}