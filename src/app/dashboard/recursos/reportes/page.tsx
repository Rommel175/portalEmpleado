'use client';

import { useEffect, useState } from 'react';
import ContainerOptions from '@/components/containers/ContainerOptions';
import styles from './reportes.module.css';
import ReportesTable from '@/components/recursos/reportes/ReportesTable';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type UserData = {
  id: string,
  nombre: string,
  apellido: string,
  email: string,
  image: string,
  horas_semanales: string,
  horas_restantes: string
};

export default function ReportesPage() {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [totalHorasTrabajadas, setTotalHorasTrabajadas] = useState<string>('00:00');
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  const [reciente, setReciente] = useState(true);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id);

      if (errorProfile) {
        console.error('Error fetching profiles: ', errorProfile);
        return;
      }

      if (!dataProfile || dataProfile.length === 0) {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      const date = new Date();
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 5);
      endOfWeek.setHours(0, 0, 0, 0);

      let totalHoras = 0;
      const users: UserData[] = [];
      
      const selectedProfiles = Object.keys(checkedState)
        .filter((key) => checkedState[parseInt(key)])
        .map((key) => parseInt(key));

      console.log(selectedProfiles);

      for (const profile of dataProfile) {
        const { data: fichajeJornada } = await supabase
          .from('fichaje_jornada')
          .select('*')
          .eq('profile_id', profile.id)
          .gte('date', startOfWeek.toISOString())
          .lt('date', endOfWeek.toISOString()); 

        let totalHorasNetas = 0;

        if (fichajeJornada && fichajeJornada.length > 0) {
          for (const jornada of fichajeJornada) {
            const { data: eventos } = await supabase
              .from('fichaje_eventos')
              .select('evento, date')
              .eq('fichaje_id', jornada.id)
              .order('date', { ascending: true });

            if (eventos && eventos.length > 0) {
              let inicioJornada: Date | null = null;
              let finJornada: Date | null = null;
              let pausaInicio: Date | null = null;
              let totalPausas = 0;

              for (const evento of eventos) {
                const hora = new Date(evento.date);

                if (evento.evento === 'Inicio Jornada' && !inicioJornada) {
                  inicioJornada = hora;
                } else if (evento.evento === 'Jornada Finalizada') {
                  finJornada = hora;
                } else if (evento.evento === 'Inicio Pausa') {
                  pausaInicio = hora;
                } else if (evento.evento === 'Final Pausa' && pausaInicio && hora) {
                  totalPausas += (hora.getTime() - pausaInicio.getTime()) / 1000 / 60 / 60;
                  pausaInicio = null;
                }
              }

              if (inicioJornada && finJornada && finJornada > inicioJornada) {
                const duracionJornada = (finJornada.getTime() - inicioJornada.getTime()) / 1000 / 60 / 60;
                const horasNetas = duracionJornada - totalPausas;
                totalHorasNetas += horasNetas;
                totalHoras += horasNetas;
              }
            }
          }
        }

        const horasRestantes = profile.horas_semana - totalHorasNetas;

        users.push({
          id: profile.id,
          nombre: profile.nombre,
          apellido: profile.apellido,
          email: profile.email,
          image: profile.image,
          horas_semanales: formatHoras(profile.horas_semana),
          horas_restantes: formatHoras(parseFloat(horasRestantes.toFixed(2)))
        });
      }

      setUsersData(users);
      setTotalHorasTrabajadas(formatHoras(totalHoras));
    };

    fetchData();
  }, [checkedState]);

  function formatHoras(horasDecimales: number): string {
    const horas = Math.floor(horasDecimales);
    const minutos = Math.round((horasDecimales - horas) * 60);
    return `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}`;
  }

  return (
    <div className={styles.container}>
      <ContainerOptions ubicacion={false}
        urlExportar={'#'}
        exportar={true}
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
        setCheckedState={setCheckedState} />

      <ReportesTable users={usersData} totalHorasTrabajadas={totalHorasTrabajadas} />
    </div>
  );
}
