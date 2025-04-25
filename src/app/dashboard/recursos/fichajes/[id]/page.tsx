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
  const [reciente, setReciente] = useState(true);
  const [profile, setProfile] = useState<Profile[]>([]);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { id } = await params;

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
        const profileId = dataProfile?.[0].id;

        function rangosPresets() {
          const now = new Date();
          let start = new Date(now);
          let end = new Date(now);

          switch (option) {
            case 'Esta semana':
              const day = start.getDay();
              const diffToMonday = day === 0 ? -6 : 1 - day;
              start.setDate(start.getDate() + diffToMonday);
              end = new Date(start);
              end.setDate(start.getDate() + 5);
              break;
            case 'Hoy':
            case 'Ayer':
              if (!startDate) return [start, end];
              start = new Date(startDate);
              start.setHours(0, 0, 0, 0);
              end = new Date(start);
              end.setDate(end.getDate() + 1);
              break;
            case 'Semana pasada':
            case 'Este mes':
            case 'Mes pasado':
              if (!startDate || !endDate) return [start, end];
              start = new Date(startDate);
              end = new Date(endDate);
              end.setDate(end.getDate() + 1);
              break;
          }

          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          return [start, end];
        }

        const [start, end] = rangosPresets();

        const { data: jornadaData, error: jornadaError } = await supabase
          .from('fichaje_jornada')
          .select('*')
          .eq('profile_id', profileId)
          .gte('date', start.toISOString())
          .lt('date', end.toISOString())
          .order('date', { ascending: !reciente });

        if (jornadaError) {
          console.log('Error fetching Jornada: ', jornadaError);
        }

        setFechas(jornadaData?.map(j => j.date) || []);
      };
    };

    fetchData();
  }, [option, startDate, endDate, localizacion, reciente]);

  return (
    <>
      <ContainerOptions
        urlExportar={'#'}
        exportar={true}
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
      />
      {
        fechas.map((fecha) => {
          return <EntradasFichajes key={fecha} date={fecha} profile={profile} localizacion={localizacion} />
        })
      }
    </>
  );
}
