'use client'

import { createClient } from '@/utils/supabase/client';
import styles from './containerTable.module.css'
import TableItem from './TableItem';
import { useEffect, useState } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Equipo, Fichaje_eventos, Fichaje_jornada, Profile } from '@/types/Types';
import dayjs from 'dayjs';
import Tooltips from '@/components/tooltip/Tooltips';

type Users = {
  id: string,
  fichaje_id: string,
  evento_id: string,
  nombre: string,
  apellido: string,
  email: string,
  estado: string,
  image: string,
  hora: string,
  hora_aprox_salida: string,
  localizacion: string,
  fecha: string
}

export default function ContainerTable({ equipo }: { equipo: Equipo[] }) {

  const [users, setUsers] = useState<Users[]>([]);
  const [currentDate, setCurrentDate] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const date = dayjs();

    setCurrentDate(date.format('DD-MM-YYYY'));

    const usersData: Users[] = [];

    equipo.map((equipoItem) => {
      const jornadas = equipoItem.fichaje_jornada.sort((a, b) => Number(a.id) - Number(b.id));
      const ultimaJornada = jornadas?.[jornadas.length - 1];
      const eventos = ultimaJornada?.fichaje_eventos.sort((a, b) => Number(a.id) - Number(b.id));

      const localizacion = eventos && eventos.length > 0 ? eventos[eventos.length - 1].localizacion : '-';
      const hora = ultimaJornada?.date ?? '-';
      const hora_aprox_salida = ultimaJornada?.date_final_aprox ?? '-';
      usersData.push({
        id: equipoItem.id,
        fichaje_id: ultimaJornada?.id,
        evento_id: eventos?.[eventos.length - 1].id,
        nombre: equipoItem.nombre,
        apellido: equipoItem.apellido,
        email: equipoItem.email,
        estado: equipoItem.estado,
        image: equipoItem.image,
        localizacion,
        hora: parseHora(hora),
        hora_aprox_salida: parseHora(hora_aprox_salida),
        fecha: parseFecha(ultimaJornada?.date)
      });
    })

    setUsers(usersData);

    const profilesRealTime = supabase
      .channel('realtime-profiles')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
      }, (payload: RealtimePostgresChangesPayload<Profile>) => {
        //console.log(payload);
        switch (payload.eventType) {
          case 'UPDATE':
            const updatedItem = payload.new;
            //console.log(updatedItem.id)
            setUsers((prevState) => prevState.map(user => user.id === updatedItem.id ? { ...user, estado: updatedItem.estado, name: updatedItem.nombre, email: updatedItem.email, image: updatedItem.image } : user));
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
        //console.log(payload);
        switch (payload.eventType) {
          case 'INSERT':
            const insertItem = payload.new;
            setUsers((prevState) => prevState.map(user => user.id === insertItem.profile_id ? { ...user, hora_aprox_salida: parseHora(insertItem.date_final_aprox), hora: parseHora(insertItem.date), fecha: parseFecha(insertItem.date) } : user))
            break;
          case 'UPDATE':
            const updatedItem = payload.new;
            //console.log(parseFecha(updatedItem.date))
            setUsers((prevState) => prevState.map(user => user.fichaje_id === updatedItem.id ? { ...user, hora_aprox_salida: parseHora(updatedItem.date_final_aprox), hora: parseHora(updatedItem.date), fecha: parseFecha(updatedItem.date) } : user))
            //console.log(users)
            break;
        }
      })
      .subscribe();

    const eventosRealTime = supabase
      .channel('realtime-fichaje_eventos')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'fichaje_eventos',
      }, (payload: RealtimePostgresChangesPayload<Fichaje_eventos>) => {
        //console.log(payload);
        switch (payload.eventType) {
          case 'INSERT':
            const insertItem = payload.new;
            setUsers((prevState) => prevState.map(user => user.fichaje_id === insertItem.fichaje_id ? { ...user, localizacion: insertItem.localizacion } : user))
            break;
          case 'UPDATE':
            const updatedItem = payload.new;
            setUsers((prevState) => prevState.map(user => user.evento_id === updatedItem.id ? { ...user, localizacion: updatedItem.localizacion } : user))
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

  function parseHora(hora: string | Date): string {
    if (!hora) return '-';
    const date = dayjs(hora);
    if (!date.isValid()) return '-';
    return date.format('HH:mm')
  }

  function parseFecha(fecha: string | Date): string {
    if (!fecha) return '-';
    const date = dayjs(fecha);
    if (!date.isValid()) return '-';
    return date.format('DD-MM-YYYY')
  }

  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <h3>Usuario</h3>
        <h3>Estado</h3>
        <h3>Localización</h3>
        <h3>Inicio Jornada</h3>
        <h3>
          Prev Fin Jornada
          <Tooltips infoText='Esta es la hora prevista a la que el usuario terminará su jornada laboral'>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.97506 9C6.15006 9 6.29806 8.9395 6.41906 8.8185C6.54006 8.6975 6.60039 8.54967 6.60006 8.375C6.59973 8.20034 6.53939 8.05234 6.41906 7.931C6.29873 7.80967 6.15073 7.74934 5.97506 7.75C5.79939 7.75067 5.65156 7.81117 5.53156 7.9315C5.41156 8.05184 5.35106 8.19967 5.35006 8.375C5.34906 8.55034 5.40956 8.69834 5.53156 8.819C5.65356 8.93967 5.80139 9 5.97506 9ZM5.52506 7.075H6.45006C6.45006 6.8 6.48139 6.58334 6.54406 6.425C6.60673 6.26667 6.78373 6.05 7.07506 5.775C7.29173 5.55834 7.46256 5.352 7.58756 5.156C7.71256 4.96 7.77506 4.72467 7.77506 4.45C7.77506 3.98334 7.60423 3.625 7.26256 3.375C6.92089 3.125 6.51673 3 6.05006 3C5.57506 3 5.18973 3.125 4.89406 3.375C4.5984 3.625 4.39206 3.925 4.27506 4.275L5.10006 4.6C5.14173 4.45 5.23556 4.2875 5.38156 4.1125C5.52756 3.9375 5.75039 3.85 6.05006 3.85C6.31673 3.85 6.51673 3.923 6.65006 4.069C6.78339 4.215 6.85006 4.37534 6.85006 4.55C6.85006 4.71667 6.80006 4.873 6.70006 5.019C6.60006 5.165 6.47506 5.30034 6.32506 5.425C5.95839 5.75 5.7334 5.99584 5.65006 6.1625C5.56673 6.32917 5.52506 6.63334 5.52506 7.075ZM6.00006 11C5.30839 11 4.6584 10.8688 4.05006 10.6065C3.44173 10.3442 2.91256 9.98784 2.46256 9.5375C2.01256 9.08717 1.6564 8.558 1.39406 7.95C1.13173 7.342 1.0004 6.692 1.00006 6C0.999728 5.308 1.13106 4.658 1.39406 4.05C1.65706 3.442 2.01323 2.91284 2.46256 2.4625C2.9119 2.01217 3.44106 1.656 4.05006 1.394C4.65906 1.132 5.30906 1.00067 6.00006 1C6.69106 0.999336 7.34106 1.13067 7.95006 1.394C8.55906 1.65734 9.08823 2.0135 9.53756 2.4625C9.9869 2.9115 10.3432 3.44067 10.6066 4.05C10.8699 4.65934 11.0011 5.30934 11.0001 6C10.9991 6.69067 10.8677 7.34067 10.6061 7.95C10.3444 8.55934 9.98823 9.0885 9.53756 9.5375C9.0869 9.9865 8.55773 10.3428 7.95006 10.6065C7.34239 10.8702 6.69239 11.0013 6.00006 11Z" fill="#285FF5" />
            </svg>
          </Tooltips>
        </h3>
      </div>

      {
        users.map((item, index) => {
          return <TableItem key={index} nombre={item.nombre} apellido={item.apellido} email={item.email} estado={item.estado} foto={item.image} localizacion={(currentDate == item.fecha) ? item.localizacion : '-'} inicio={(currentDate == item.fecha) ? item.hora : '-'} final={(currentDate == item.fecha) ? item.hora_aprox_salida : '-'} />
        })
      }
    </div>
  );
}
