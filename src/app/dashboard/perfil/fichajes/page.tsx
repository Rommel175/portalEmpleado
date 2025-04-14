//'use client'

import EntradasFichajes from '@/components/containers/historialFichajes/EntradasFichajes';
import ContainerOptions from '@/components/containers/ContainerOptions';
import { createClient } from '@/utils/supabase/server';
//import { useEffect, useState } from 'react';
//import { createClient } from '@/utils/supabase/client';

export default async function Fichajes() {

  //const [fichajes, setFichajes] = useState<string[]>([]);
  const supabase = await createClient();

  const fichajes: string[] = [];

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log('Error fetching User:', error);
  }

  if (data) {
    const { data: dataProfile, error: errorProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', data.user?.id)

    if (errorProfile) {
      console.log('Error fetching Profile: ', errorProfile)
    }

    if (dataProfile && dataProfile.length > 0) {
      const { data: dataJornada, error: errorJornada } = await supabase
        .from('fichaje_jornada')
        .select('*')
        .eq('profile_id', dataProfile[0].id)
        .order('created_at', {ascending: false});

      if (errorJornada) {
        console.log('Error fetching Jornada: ', errorJornada);
      }

      if (dataJornada && dataJornada.length > 0) {

        for (let i = 0; i < dataJornada.length; i++) {
          fichajes.push(dataJornada[i].created_at);
        }
      }

      
    }
  }

  /*useEffect(() => {
    const fetchData = async () => {

      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.log('Error fetching User: ', error)
      }

      if (data) {
        const { data: dataProfile, error: errorProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', data.user?.id)

        if (errorProfile) {
          console.log('Error fetching Profile: ', errorProfile)
        }

        if (dataProfile && dataProfile.length > 0) {
          const { data: dataJornada, error: errorJornada } = await supabase
            .from('fichaje_jornada')
            .select('*')
            .eq('profile_id', dataProfile[0].id)
            .order('created_at', {ascending: false});

          if (errorJornada) {
            console.log('Error fetching Jornada: ', errorJornada);
          }

          if (dataJornada && dataJornada.length > 0) {
            //console.log(dataJornada)
            const fechas: string[] = [];

            for (let i = 0; i < dataJornada.length; i++) {
              //console.log(dataJornada[i].created_at)
              fechas.push(dataJornada[i].created_at);
            }

            setFichajes(fechas);
          }

          
        }
      }
    }

    fetchData();
  }, [])*/

  return (
    <>
      <ContainerOptions urlExportar={'#'} usuarios={false} />
      {
        fichajes.map((fecha) => {
          return <EntradasFichajes key={fecha} date={fecha}/>
        })
      }

    </>
  );
}