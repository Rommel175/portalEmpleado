'use client'

import IncidenciasCard from '@/components/recursos/incidencias/IncidenciasCard';
import styles from './incidencias.module.css'
import { useEffect, useState } from 'react';

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
      }
    }

    fetchData();
  }, [])

  return (
    <div className={styles.container}>
      {
        //JSON.stringify(soicitudes)
      }
      {
        soicitudes.map((item, index) => {
          return <IncidenciasCard key={index} id={item.id} image={item.image} nombre={item.nombre} apellido={item.apellido} email={item.email} created_at={item.created_at} evento={item.evento} fecha_original={item.fecha_original} fecha_solicitada={item.fecha_solicitada} motivo={item.motivo} fichaje_evento_id={item.fichaje_evento_id} />
        })
      }
    </div>
  );
}