'use client'

import ContainerOptions from '@/components/containers/ContainerOptions';
import EntradaSolicitudes from '@/components/containers/historialSolicitudes/EntradaSolicitudes';
import { useEffect, useState } from 'react';
import styles from './solicitudes.module.css';
import DropdownExportarSolicitudes from '@/components/customInputs/dropdownExportar/exportarSolicitudes/DropdownExportarSolicitudes';
import dayjs from 'dayjs';
import { SolicitudesType } from '@/types/Types';
import Loading from '@/components/loading/Loading';

export default function Solicitudes() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  const [reciente, setReciente] = useState(true);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const [checkedStateRegistro, setCheckedStateRegistro] = useState<{ [key: string]: boolean }>({});
  const [registroSelected, setRegistroSelected] = useState(0);

  const [solicitudes, setSolicitudes] = useState<SolicitudesType[]>([]);
  const [activarFiltros, setActivarFiltros] = useState(0);
  const [borrarFiltros, setBorrarFiltros] = useState(0);
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    option: 'Esta semana',
    localizacion: 'all',
    reciente: true,
    checkedStateRegistro: {},
  });
  const [isLoading, setIsLoading] = useState(false);

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

      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          option: option,
          startDate: start ? start.toISOString() : '',
          endDate: end ? end.toISOString() : '',
          reciente: reciente ? 'true' : 'false',
          checkedStateRegistro: JSON.stringify(checkedStateRegistro)
        });

        const res = await fetch(`/api/solicitudes/obtener?${params.toString()}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          console.error('Error en la respuesta:', res.status);
          return;
        }

        const result = await res.json();

        if (result.success) {
          setSolicitudes(result.data);
        }
      } catch (error) {
        console.log('Error cargando datos: ', error);
      } finally {
        setIsLoading(false)
      }
    }

    fetchData();
  }, [activarFiltros, borrarFiltros]);

  useEffect(() => {
    const countSelected = Object.values(checkedStateRegistro).filter((val) => val === true).length;
    setRegistroSelected(countSelected);
  }, [checkedStateRegistro]);

  /*const hayFiltrosActivos = (
    option !== 'Esta semana' ||
    localizacion !== 'all' ||
    !reciente ||
    Object.values(checkedStateRegistro).some((val) => val)
  );*/

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
      {
        (isLoading) &&
        <Loading />
      }
      <div className={styles.options}>
        <DropdownExportarSolicitudes solicitudes={solicitudes} />
        <ContainerOptions
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
          checkedState={checkedState}
          setCheckedState={setCheckedState}
          checkedStateRegistro={checkedStateRegistro}
          setCheckedStateRegistro={setCheckedStateRegistro}
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
        !isLoading && solicitudes.length == 0 ? (
          <p>No hay solicitudes</p>
        ) :
          solicitudes.map((item, index) => {
            return <EntradaSolicitudes key={index} created_at={item.created_at} fecha_original={item.fecha_original} fecha_solicitada={item.fecha_solicitada} evento={item.evento} motivo={item.motivo} />
          })
      }
    </>
  );
}