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
            if (!startDate) return;
            const startToday = new Date(startDate);
            startToday.setHours(0, 0, 0, 0);

            const endToday = new Date(startDate);
            endToday.setDate(endToday.getDate() + 1);
            endToday.setHours(0, 0, 0, 0);

            const { data: dataHoy, error: errorHoy } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startToday.toISOString())
              .lt('date', endToday.toISOString())
              .order('date', { ascending: false });

            if (errorHoy) {
              console.log('Error fetching Jornada: ', errorHoy);
            }

            if (dataHoy && dataHoy.length > 0) {
              const fetchedFechas = dataHoy.map(jornada => jornada.date);
              setFechas(fetchedFechas);
              console.log(dataHoy)
            }
            break;
          case 'Ayer':
            if (!startDate) return;
            const startYesterday = new Date(startDate);
            startYesterday.setHours(0, 0, 0, 0);

            const endYesterday = new Date(startDate);
            endYesterday.setDate(endYesterday.getDate() + 1);
            endYesterday.setHours(0, 0, 0, 0);

            const { data: dataAyer, error: errorAyer } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startYesterday.toISOString())
              .lt('date', endYesterday.toISOString())
              .order('date', { ascending: false });

            if (errorAyer) {
              console.log('Error fetching Jornada: ', errorAyer);
            }

            if (dataAyer && dataAyer.length > 0) {
              const fetchedFechas = dataAyer.map(jornada => jornada.date);
              setFechas(fetchedFechas);
              console.log(dataAyer)
            }
            break;
        }
      }
    };

    fetchData();
  }, [option, startDate, endDate]);

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
