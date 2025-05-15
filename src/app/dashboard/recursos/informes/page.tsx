'use client';

import { useEffect, useState } from 'react';
import ContainerOptions from '@/components/containers/ContainerOptions';
import styles from './informes.module.css';
import ReportesTable from '@/components/recursos/reportes/ReportesTable';
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
  horas_restantes: string
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
  const isSelected = Object.values(checkedState).some((val) => val === true);

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


      const res = await fetch(`/api/reportes?${params.toString()}`, {
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
  }, [option, checkedState]);

  useEffect(() => {
    const countSelected = Object.values(checkedState).filter((val) => val === true).length;
    setUsersSelected(countSelected);
  }, [checkedState]);

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
          <DropdownExportarInformes checkedState={checkedState} usersData={usersData} isSelected={isSelected} />
        </div>

        <ContainerOptions
          recientes={true}
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
        />
      </div>

      <ReportesTable users={usersData} totalHorasTrabajadas={totalHorasTrabajadas} checkedState={checkedState} setCheckedState={setCheckedState} titulo={titulo} isSelected={isSelected}/>
    </div>
  );
}
