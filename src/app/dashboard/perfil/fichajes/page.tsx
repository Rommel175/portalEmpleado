'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import ContainerOptions from '@/components/containers/ContainerOptions';
import EntradasFichajes from '@/components/containers/historialFichajes/EntradasFichajes';
import { Profile } from '@/types/Types';

export default function Fichajes() {

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [fechas, setFechas] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile[]>([]);
  const supabase = createClient();

  useEffect(() => {
    console.log(option)
    console.log(startDate?.toISOString().split('T')[0])
    console.log(endDate?.toISOString().split('T')[0])

    const fetchData = async () => {

      const date = new Date();
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 5);
      endOfWeek.setHours(0, 0, 0, 0);

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.log('Error fetching User:', error);
        return;
      }

      const user = data?.user;

      const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id);

      if (errorProfile) {
        console.log('Error fetching Profile: ', errorProfile);
        return;
      }

      if (dataProfile && dataProfile.length > 0) {
        setProfile(dataProfile);

        switch (option) {
          case 'Esta semana':
            const { data: dataSemana, error: errorSemana } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startOfWeek.toISOString())
              .lt('date', endOfWeek.toISOString())
              .order('date', { ascending: false });

            if (errorSemana) {
              console.log('Error fetching Jornada: ', errorSemana);
            }

            if (dataSemana && dataSemana.length > 0) {
              const fetchedFechas = dataSemana.map(jornada => jornada.date);
              setFechas(fetchedFechas);
            }
            break;
          case 'Hoy':
            if (endDate) {

              const { data: dataHoy, error: errorHoy } = await supabase
                .from('fichaje_jornada')
                .select('*')
                .eq('profile_id', dataProfile[0].id)
                .filter('date', 'gte', `${startDate}T00:00:00`)
                .filter('date', 'lt', `${startDate}T23:59:59`)
                .order('date', { ascending: false });

              if (errorHoy) {
                console.log('Error fetching Jornada: ', errorHoy);
              }

              if (dataHoy && dataHoy.length > 0) {
                const fetchedFechas = dataHoy.map(jornada => jornada.date);
                setFechas(fetchedFechas);
              }
            } else {
              console.log('No endDate provided');
            }
            break;
        }
      }
    };

    fetchData();
  }, [option]);

  return (
    <>
      <ContainerOptions
        urlExportar={'#'}
        usuarios={false}
        añadirUsuario={false}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        option={option}
        setOption={setOption}
      />
      {
        fechas.map((fecha) => {
          return <EntradasFichajes key={fecha} date={fecha} profile={profile} />
        })
      }
    </>
  );
}
