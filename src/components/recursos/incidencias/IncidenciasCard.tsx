'use client'

import { createClient } from '@/utils/supabase/client'
import styles from './incidenciasCard.module.css'
import IncidenciasCardDate from './IncidenciasCardDate'
import IncidenciasCardHeader from './IncidenciasCardHeader'
import dayjs from 'dayjs'
import { Profile } from '@/types/Types'

export default function IncidenciasCard({ id, image, nombre, apellido, email, created_at, evento, fecha_original, fecha_solicitada, motivo, fichaje_evento_id, supervisor }: { id: string, image: string, nombre: string, apellido: string, email: string, created_at: Date, evento: string, fecha_original: Date, fecha_solicitada: Date, motivo: string, fichaje_evento_id: string, supervisor: Profile[] }) {

  const supabase = createClient();

  function handleAceptar() {

    const now = dayjs();

    const aceptar = async () => {
      const { error: errorAceptar } = await supabase
        .from('solicitudes')
        .update({ estado: 'aceptada' })
        .eq('id', id);

      if (errorAceptar) {
        console.log('Error updatingAceptarSolicitud:', errorAceptar);
        return;
      }

      const { error: errorFichajeEvento } = await supabase
        .from('fichaje_eventos')
        .update({modificado: true})
        .eq('id', fichaje_evento_id);
       
      if (errorFichajeEvento) {
        console.log('Error updatingAceptarSolicitud:', errorFichajeEvento);
        return;
      }  

      const { error: errorInsertModificacion } = await supabase
        .from('modificaciones_eventos')
        .insert({created_at: now.toISOString(), fichaje_evento_id: fichaje_evento_id, supervisor_id: supervisor[0].id, fecha_original: dayjs(fecha_original).toISOString(), fecha_modificada: dayjs(fecha_solicitada).toISOString(), evento: evento, motivo: motivo})

      if (errorInsertModificacion) {
        console.log('Error insert Modificación: ', errorInsertModificacion);
        return;
      }  
    }

    aceptar();
  }

  function handleRechazar() {
    const rechazar = async () => {
      const { error: errorRechazar } = await supabase
        .from('solicitudes')
        .update({ 'estado': 'rechazada' })
        .eq('id', id);

      if (errorRechazar) {
        console.log('Error updatingAceptarSolicitud:', errorRechazar);
      }
    }

    rechazar();
  }


  return (
    <div className={styles.card}>
      <IncidenciasCardHeader image={image} nombre={nombre} apellido={apellido} email={email} created_at={created_at} />

      <IncidenciasCardDate evento={evento} fecha_original={fecha_original} fecha_solicitada={fecha_solicitada} />

      <div className={styles.message}>
        <p>{motivo}</p>
      </div>

      <div className={styles.buttons}>
        <button onClick={handleRechazar}>Denegar</button>
        <button onClick={handleAceptar}>Aceptar</button>
      </div>
    </div>
  );
}