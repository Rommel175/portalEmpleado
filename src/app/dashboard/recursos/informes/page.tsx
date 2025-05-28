'use client';

import { useEffect, useState } from 'react';
import ContainerOptions from '@/components/containers/ContainerOptions';
import styles from './informes.module.css';
import InformesTable from '@/components/recursos/informes/InformesTable';
import ActividadCard from '@/components/cards/Actividad';
import SelectAll from '@/components/customInputs/customCheckbox/SelectAll';
import dayjs from 'dayjs';
import DropdownExportarInformes from '@/components/customInputs/dropdownExportar/exportarInformes/DropdownExportarInformes';

type UserData = {
  id: string,
  nombre: string,
  apellido: string,
  email: string,
  image: string,
  horas_semanales: string,
  horas_restantes: string,
  horas_trabajadas: string
};

export default function InformesPage() {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [totalHorasTrabajadas, setTotalHorasTrabajadas] = useState<string>('00:00');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  const [reciente, setReciente] = useState(true);
  const [horasEquipo, setHorasEquipo] = useState(0);
  const [titulo, setTitulo] = useState('Horas semanales');
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const [checkedStateRegistro, setCheckedStateRegistro] = useState<{ [key: string]: boolean }>({});
  const [usersSelected, setUsersSelected] = useState(0);
  const [activarFiltros, setActivarFiltros] = useState(0);
  const [borrarFiltros, setBorrarFiltros] = useState(0);
  const isSelected = Object.values(checkedState).some((val) => val === true);
  const [filtrosAplicados, setFiltrosAplicados] = useState<{
    option: string;
    checkedState: { [key: string]: boolean };
  } | null>(null);


  useEffect(() => {
    const fetchData = async () => {

      let start = startDate;
      let end = endDate;


      if (!startDate || !endDate) {
        const now = dayjs();

        start = now.day(1).startOf('day').toDate();
        end = now.day(1).add(5, 'day').endOf('day').toDate();

        setStartDate(start);
        setEndDate(end);
      }

      const params = new URLSearchParams({
        option: option,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
        reciente: reciente.toString(),
        checkedState: JSON.stringify(checkedState),
      });


      const res = await fetch(`/api/informes?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        console.error('Error en la respuesta:', res.status);
        return;
      }

      const result = await res.json();

      if (result.success) {
        setUsersData(result.users)
        setTotalHorasTrabajadas(result.totalHoras);
        setHorasEquipo(result.minutosEquipo);
        if (Object.keys(checkedState).length === 0) {
          const initialState = Object.fromEntries(
            result.users.map((user: UserData) => [user.id, false])
          );
          setCheckedState(initialState);
        }
        setTitulo(result.tituloHoras)
      }
    };

    fetchData();
  }, [activarFiltros, borrarFiltros]);

  useEffect(() => {
    const allUsersLoaded = usersData.length > 0;
    const allCheckboxesLoaded = Object.keys(checkedState).length === usersData.length;

    if (allUsersLoaded && allCheckboxesLoaded && filtrosAplicados === null) {
      setFiltrosAplicados({
        option,
        checkedState,
      });
    }
  }, [checkedState, usersData, filtrosAplicados, option]);


  useEffect(() => {
    const countSelected = Object.values(checkedState).filter((val) => val === true).length;
    setUsersSelected(countSelected);
  }, [checkedState]);

  /*const hayFiltrosActivos = (
    option !== 'Esta semana' ||
    !reciente ||
    Object.values(checkedState).some((val) => val)
  );*/

  function resetFiltros() {
    setOption('Esta semana');
    setCheckedState({});
    setBorrarFiltros(prev => prev + 1)
  }

  function activarFiltrosHandler() {
    setActivarFiltros(prev => prev + 1);
    setFiltrosAplicados({
      option,
      checkedState,
    });
  };

  const hayCambiosEnFiltros = filtrosAplicados !== null && (
    option !== filtrosAplicados.option ||
    JSON.stringify(checkedState) !== JSON.stringify(filtrosAplicados.checkedState)
  );


  return (
    <div className={styles.container}>
      <ActividadCard horas={totalHorasTrabajadas} total={horasEquipo} />
      <div className={styles.options}>
        <div className={styles.exportar}>
          {
            isSelected &&
            <div className={styles.selected}>
              <SelectAll checkedState={checkedState} setCheckedState={setCheckedState} />
              <label> {usersSelected} seleccionados</label>
            </div>
          }
          <DropdownExportarInformes checkedState={checkedState} usersData={usersData} titulo={titulo} />
        </div>

        <ContainerOptions
          /*recientes={true}*/
          usuarios={true}
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
          totalUsuarios={usersSelected}
          checkedStateRegistro={checkedStateRegistro}
          setCheckedStateRegistro={setCheckedStateRegistro}
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

      <InformesTable users={usersData} totalHorasTrabajadas={totalHorasTrabajadas} checkedState={checkedState} setCheckedState={setCheckedState} titulo={titulo} isSelected={isSelected} />
    </div>
  );
}
