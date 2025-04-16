'use client'

import { createClient } from '@/utils/supabase/client';
import styles from './containerTable.module.css'
import TableItem from './TableItem';
import { useEffect, useState } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Equipo, Fichaje_eventos, Fichaje_jornada, Profile } from '@/types/Types';

export default function ContainerTable({ equipo }: {equipo: Equipo[] }) {

  type Users = {
    profile_id: string,
    fichaje_id: string,
    evento_id: string,
    name: string;
    email: string;
    estado: string;
    image: string;
    hora: string,
    hora_aprox_salida: string,
    localizacion: string,
    date: string
  }

  const [users, setUsers] = useState<Users[]>([]);
  const [currentDate, setCurrentDate] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    //console.log(`${year}-${month}-${day}`);

    setCurrentDate(`${year}-${month}-${day}`);



    const usersData: Users[] = [];

    equipo.map((equipoItem) => {
      const jornadas = equipoItem.fichaje_jornada;
      const ultimaJornada = jornadas?.[jornadas.length - 1];
      const eventos = ultimaJornada?.fichaje_eventos.sort((a, b) => Number(a.id) - Number(b.id));

      const localizacion = eventos && eventos.length > 0 ? eventos[eventos.length - 1].localizacion : '-';
      const hora = ultimaJornada?.hora ?? '-';
      const hora_aprox_salida = ultimaJornada?.hora_aprox_salida ?? '-';
      usersData.push({
        profile_id: equipoItem.id,
        fichaje_id: ultimaJornada?.id,
        evento_id: eventos?.[eventos.length - 1].id,
        name: equipoItem.full_name,
        email: equipoItem.email,
        estado: equipoItem.estado,
        image: equipoItem.image,
        localizacion,
        hora,
        hora_aprox_salida,
        date: ultimaJornada?.created_at
      });
    }) 

    //console.log(usersData);
      

    setUsers(usersData);

    const profilesRealTime = supabase
      .channel('realtime-profiles')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
      }, (payload: RealtimePostgresChangesPayload<Profile>) => {
        console.log(payload);
        switch (payload.eventType) {
          case 'UPDATE':
            const updatedItem = payload.new;
            setUsers((prevState) => prevState.map(user => user.profile_id === updatedItem.id ? { ...user, estado: updatedItem.estado } : user));
            break;
        }
      })
      .subscribe();

    const jornadaRealTime = supabase
      .channel('realtime-fichaje_jornada')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'fichaje_jornada',
      }, (payload: RealtimePostgresChangesPayload<Fichaje_jornada>) => {
        console.log(payload);
        switch (payload.eventType) {
          case 'INSERT':
            const insertItem = payload.new;
            setUsers((prevState) => prevState.map(user => user.profile_id === insertItem.profile_id ? { ...user, hora_aprox_salida: insertItem.hora_aprox_salida, hora: insertItem.hora } : user))
            break;
          case 'UPDATE':
            const updatedItem = payload.new;
            setUsers((prevState) => prevState.map(user => user.profile_id === updatedItem.id ? { ...user, hora_aprox_salida: updatedItem.hora_aprox_salida, hora: updatedItem.hora } : user))
            break;
        }
      })
      .subscribe();

    //Arreglar esto:
    const eventosRealTime = supabase
      .channel('realtime-fichaje_eventos')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'fichaje_eventos',
      }, (payload: RealtimePostgresChangesPayload<Fichaje_eventos>) => {
        console.log(payload);
        switch (payload.eventType) {
          case 'INSERT':
            const insertItem = payload.new;
            setUsers((prevState) => prevState.map(user => user.fichaje_id === insertItem.fichaje_id ? {...user, localizacion: insertItem.localizacion} : user))
            break;
          case 'UPDATE':
            const updatedItem = payload.new;
            setUsers((prevState) => prevState.map(user => user.evento_id === updatedItem.id ? {...user, localizacion: updatedItem.localizacion} : user))
            break;
        }


      })
      .subscribe();

    return () => {
      supabase.removeChannel(profilesRealTime);
      supabase.removeChannel(jornadaRealTime);
      supabase.removeChannel(eventosRealTime);
    };

  }, [])

  return (
    <div className={styles.table}>
      <div className={styles.tableNav}>
        <h3>Usuario</h3>
        <h3>Estado</h3>
        <h3>Localización</h3>
        <h3>Inicio Jornada</h3>
        <h3>
          Prev Fin Jornada
          <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.975 9.49988C6.15 9.49988 6.298 9.43938 6.419 9.31838C6.54 9.19738 6.60033 9.04955 6.6 8.87488C6.59967 8.70021 6.53933 8.55221 6.419 8.43088C6.29867 8.30955 6.15067 8.24921 5.975 8.24988C5.79933 8.25055 5.6515 8.31105 5.5315 8.43138C5.4115 8.55171 5.351 8.69955 5.35 8.87488C5.349 9.05021 5.4095 9.19821 5.5315 9.31888C5.6535 9.43955 5.80133 9.49988 5.975 9.49988ZM5.525 7.57488H6.45C6.45 7.29988 6.48133 7.08321 6.544 6.92488C6.60667 6.76655 6.78367 6.54988 7.075 6.27488C7.29167 6.05821 7.4625 5.85188 7.5875 5.65588C7.7125 5.45988 7.775 5.22455 7.775 4.94988C7.775 4.48321 7.60417 4.12488 7.2625 3.87488C6.92083 3.62488 6.51667 3.49988 6.05 3.49988C5.575 3.49988 5.18967 3.62488 4.894 3.87488C4.59833 4.12488 4.392 4.42488 4.275 4.77488L5.1 5.09988C5.14167 4.94988 5.2355 4.78738 5.3815 4.61238C5.5275 4.43738 5.75033 4.34988 6.05 4.34988C6.31667 4.34988 6.51667 4.42288 6.65 4.56888C6.78333 4.71488 6.85 4.87521 6.85 5.04988C6.85 5.21655 6.8 5.37288 6.7 5.51888C6.6 5.66488 6.475 5.80021 6.325 5.92488C5.95833 6.24988 5.73333 6.49571 5.65 6.66238C5.56667 6.82905 5.525 7.13321 5.525 7.57488ZM6 11.4999C5.30833 11.4999 4.65833 11.3687 4.05 11.1064C3.44167 10.844 2.9125 10.4877 2.4625 10.0374C2.0125 9.58705 1.65633 9.05788 1.394 8.44988C1.13167 7.84188 1.00033 7.19188 1 6.49988C0.999667 5.80788 1.131 5.15788 1.394 4.54988C1.657 3.94188 2.01317 3.41271 2.4625 2.96238C2.91183 2.51205 3.441 2.15588 4.05 1.89388C4.659 1.63188 5.309 1.50055 6 1.49988C6.691 1.49921 7.341 1.63055 7.95 1.89388C8.559 2.15721 9.08817 2.51338 9.5375 2.96238C9.98683 3.41138 10.3432 3.94055 10.6065 4.54988C10.8698 5.15921 11.001 5.80921 11 6.49988C10.999 7.19055 10.8677 7.84055 10.606 8.44988C10.3443 9.05921 9.98817 9.58838 9.5375 10.0374C9.08683 10.4864 8.55767 10.8427 7.95 11.1064C7.34233 11.37 6.69233 11.5012 6 11.4999Z" fill="#333333" />
          </svg>
        </h3>
      </div>

      {
        users.map((item, index) => {
          return <TableItem key={index} name={item.name} email={item.email} estado={item.estado} foto={item.image} localizacion={(currentDate == item.date) ? item.localizacion : ' - '} inicio={(currentDate == item.date) ? item.hora : '-'} final={(currentDate == item.date) ? item.hora_aprox_salida : '-'} />
        })
      }
    </div>
  );
}
