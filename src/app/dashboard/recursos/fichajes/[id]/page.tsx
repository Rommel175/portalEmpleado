'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import ContainerOptions from '@/components/containers/ContainerOptions';
import EntradasFichajes from '@/components/containers/historialFichajes/EntradasFichajes';
import { Profile } from '@/types/Types';

export default function Fichajes({ params }: { params: Promise<{ id: string }> }) {

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [fechas, setFechas] = useState<string[]>([]);
  const [localizacion, setLocalizacion] = useState('all');
  const [profile, setProfile] = useState<Profile[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      console.log(localizacion)

      const date = new Date();
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 5);
      endOfWeek.setHours(0, 0, 0, 0);

      const {id} = await params;

      const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id);

      if (errorProfile) {
        console.log('Error fetching Profile: ', errorProfile);
        return;
      }

      if (dataProfile && dataProfile.length > 0) {
        setProfile(dataProfile);

        switch (option) {
          case 'Esta semana':
            const { data: dataThisWeek, error: errorThisWeek } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startOfWeek.toISOString())
              .lt('date', endOfWeek.toISOString())
              .order('date', { ascending: false });

            if (errorThisWeek) {
              console.log('Error fetching Jornada: ', errorThisWeek);
            }

            if (dataThisWeek && dataThisWeek.length > 0) {
              const fetchedFechas = dataThisWeek.map(jornada => jornada.date);
              setFechas(fetchedFechas);
            } else {
              setFechas([]);
            }
            break;
          case 'Hoy':
            if (!startDate) return;
            const startToday = new Date(startDate);
            startToday.setHours(0, 0, 0, 0);

            const endToday = new Date(startDate);
            endToday.setDate(endToday.getDate() + 1);
            endToday.setHours(0, 0, 0, 0);

            const { data: dataToday, error: errorToday } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startToday.toISOString())
              .lt('date', endToday.toISOString())
              .order('date', { ascending: false });

            if (errorToday) {
              console.log('Error fetching Jornada: ', errorToday);
            }

            if (dataToday && dataToday.length > 0) {
              const fetchedFechas = dataToday.map(jornada => jornada.date);
              setFechas(fetchedFechas);
            } else {
              setFechas([]);
            }
            break;
          case 'Ayer':
            if (!startDate) return;
            const startYesterday = new Date(startDate);
            startYesterday.setHours(0, 0, 0, 0);

            const endYesterday = new Date(startDate);
            endYesterday.setDate(endYesterday.getDate() + 1);
            endYesterday.setHours(0, 0, 0, 0);

            const { data: dataYesterday, error: errorYesterday } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startYesterday.toISOString())
              .lt('date', endYesterday.toISOString())
              .order('date', { ascending: false });

            if (errorYesterday) {
              console.log('Error fetching Jornada: ', errorYesterday);
            }

            if (dataYesterday && dataYesterday.length > 0) {
              const fetchedFechas = dataYesterday.map(jornada => jornada.date);
              setFechas(fetchedFechas);
            } else {
              setFechas([]);
            }
            break;
          case 'Semana pasada':
            if (!startDate) return;
            if (!endDate) return
            const startLastWeek = new Date(startDate);
            startLastWeek.setHours(0, 0, 0, 0);

            const endLastWeek = new Date(endDate);
            endLastWeek.setDate(endLastWeek.getDate() + 1);
            endLastWeek.setHours(0, 0, 0, 0);

            const { data: dataLastWeek, error: errorLastWeek } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startLastWeek.toISOString())
              .lt('date', endLastWeek.toISOString())
              .order('date', { ascending: false });

            if (errorLastWeek) {
              console.log('Error fetching Jornada: ', errorLastWeek);
            }

            if (dataLastWeek && dataLastWeek.length > 0) {
              const fetchedFechas = dataLastWeek.map(jornada => jornada.date);
              setFechas(fetchedFechas);
            } else {
              setFechas([]);
            }
            break;
          case 'Este mes':
            if (!startDate) return;
            if (!endDate) return
            const startThisMonth = new Date(startDate);
            startThisMonth.setHours(0, 0, 0, 0);

            const endThisMonth = new Date(endDate);
            endThisMonth.setDate(endThisMonth.getDate() + 1);
            endThisMonth.setHours(0, 0, 0, 0);

            const { data: dataThisMonth, error: errorThisMonth } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startThisMonth.toISOString())
              .lt('date', endThisMonth.toISOString())
              .order('date', { ascending: false });

            if (errorThisMonth) {
              console.log('Error fetching Jornada: ', errorThisMonth);
            }

            if (dataThisMonth && dataThisMonth.length > 0) {
              const fetchedFechas = dataThisMonth.map(jornada => jornada.date);
              setFechas(fetchedFechas);
            } else {
              setFechas([]);
            }
            break;
          case 'Mes pasado':
            if (!startDate) return;
            if (!endDate) return
            const startLastMonth = new Date(startDate);
            startLastMonth.setHours(0, 0, 0, 0);

            const endLastMonth = new Date(endDate);
            endLastMonth.setDate(endLastMonth.getDate() + 1);
            endLastMonth.setHours(0, 0, 0, 0);

            const { data: dataLastMonth, error: errorLastMonth } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startLastMonth.toISOString())
              .lt('date', endLastMonth.toISOString())
              .order('date', { ascending: false });

            if (errorLastMonth) {
              console.log('Error fetching Jornada: ', errorLastMonth);
            }

            if (dataLastMonth && dataLastMonth.length > 0) {
              const fetchedFechas = dataLastMonth.map(jornada => jornada.date);
              setFechas(fetchedFechas);
            } else {
              setFechas([]);
            }
            break;
          case 'Este año':
            if (!startDate) return;
            if (!endDate) return
            const startThisYear = new Date(startDate);
            startThisYear.setHours(0, 0, 0, 0);

            const endThisYear = new Date(endDate);
            endThisYear.setDate(endThisYear.getDate() + 1);
            endThisYear.setHours(0, 0, 0, 0);

            const { data: dataThisYear, error: errorThisYear } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startThisYear.toISOString())
              .lt('date', endThisYear.toISOString())
              .order('date', { ascending: false });

            if (errorThisYear) {
              console.log('Error fetching Jornada: ', errorThisYear);
            }

            if (dataThisYear && dataThisYear.length > 0) {
              const fetchedFechas = dataThisYear.map(jornada => jornada.date);
              setFechas(fetchedFechas);
            } else {
              setFechas([]);
            }
            break;
          case 'Año pasado':
            if (!startDate) return;
            if (!endDate) return
            const startLastYear = new Date(startDate);
            startLastYear.setHours(0, 0, 0, 0);

            const endLastYear = new Date(endDate);
            endLastYear.setDate(endLastYear.getDate() + 1);
            endLastYear.setHours(0, 0, 0, 0);

            const { data: dataLastYear, error: errorLastYear } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startLastYear.toISOString())
              .lt('date', endLastYear.toISOString())
              .order('date', { ascending: false });

            if (errorLastYear) {
              console.log('Error fetching Jornada: ', errorLastYear);
            }

            if (dataLastYear && dataLastYear.length > 0) {
              const fetchedFechas = dataLastYear.map(jornada => jornada.date);
              setFechas(fetchedFechas);
            } else {
              setFechas([]);
            }
            break;
          case '':
            if (!startDate) return;
            if (!endDate) return
            const startCustom = new Date(startDate);
            startCustom.setHours(0, 0, 0, 0);

            const endCustom = new Date(endDate);
            endCustom.setDate(endCustom.getDate() + 1);
            endCustom.setHours(0, 0, 0, 0);

            const { data: dataCustom, error: errorCustom } = await supabase
              .from('fichaje_jornada')
              .select('*')
              .eq('profile_id', dataProfile[0].id)
              .gte('date', startCustom.toISOString())
              .lt('date', endCustom.toISOString())
              .order('date', { ascending: false });

            if (errorCustom) {
              console.log('Error fetching Jornada: ', errorCustom);
            }

            if (dataCustom && dataCustom.length > 0) {
              const fetchedFechas = dataCustom.map(jornada => jornada.date);
              setFechas(fetchedFechas);
            } else {
              setFechas([]);
            }
            break;
        }
      }
    };

    fetchData();
  }, [option, startDate, endDate, localizacion]);

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
        localizacion={localizacion}
        setLocalizacion={setLocalizacion}
      />
      {
        fechas.map((fecha) => {
          return <EntradasFichajes key={fecha} date={fecha} profile={profile} localizacion={localizacion} />
        })
      }
    </>
  );
}
