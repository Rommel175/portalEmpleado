'use client'

import IncidenciasCard from '@/components/recursos/incidencias/IncidenciasCard';
import styles from './incidencias.module.css'
import { useEffect, useState } from 'react';
import { Profile, SolicitudesType } from '@/types/Types';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

type Solicitud = {
  id: string,
  image: string,
  nombre: string,
  apellido: string,
  email: string,
  fecha_original: Date,
  fecha_solicitada: Date,
  created_at: Date,
  motivo: string,
  evento: string,
  fichaje_evento_id: string
}

export default function Incidencias() {

  const [soicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [supervisor, setSupervisor] = useState<Profile[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {

      /*const params = new URLSearchParams({
        option: option,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
        reciente: reciente ? 'true' : 'false',
        checkedStateRegistro: JSON.stringify(checkedStateRegistro)
      });

      const res = await fetch(`/api/solicitudes/obtener?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });*/

      const res = await fetch(`/api/solicitudes/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        console.error('Error en la respuesta:', res.status);
        return;
      }

      const result = await res.json();

      if (result.success) {
        setSolicitudes(result.data);
        setSupervisor(result.supervisor);
      };
    }

    fetchData();

    const colicitudesRealTime = supabase
      .channel('realtime-solicitudes1')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'solicitudes',
      }, async (payload: RealtimePostgresChangesPayload<SolicitudesType[]>) => {

        switch (payload.eventType) {
          case 'INSERT':
          case 'DELETE':
          case 'UPDATE':
            console.log(payload.new);
            fetchData();
            break;
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(colicitudesRealTime);
    };

  }, [])

  return (
    <div className={styles.container}>
      {
        soicitudes.map((item, index) => {
          return <IncidenciasCard key={index} id={item.id} image={item.image} nombre={item.nombre} apellido={item.apellido} email={item.email} created_at={item.created_at} evento={item.evento} fecha_original={item.fecha_original} fecha_solicitada={item.fecha_solicitada} motivo={item.motivo} fichaje_evento_id={item.fichaje_evento_id} supervisor={supervisor} />
        })
      }
    </div>
  );
}