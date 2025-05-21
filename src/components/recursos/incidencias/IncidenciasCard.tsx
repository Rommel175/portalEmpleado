'use client'

import { createClient } from '@/utils/supabase/client'
import styles from './incidenciasCard.module.css'
import IncidenciasCardDate from './IncidenciasCardDate'
import IncidenciasCardHeader from './IncidenciasCardHeader'

export default function IncidenciasCard({ id, image, nombre, apellido, email, created_at, evento, fecha_original, fecha_solicitada, motivo, fichaje_evento_id }: { id: string, image: string, nombre: string, apellido: string, email: string, created_at: Date, evento: string, fecha_original: Date, fecha_solicitada: Date, motivo: string, fichaje_evento_id: string }) {

  const supabase = createClient();

  //Completar
  function handleAceptar() {
    console.log(fichaje_evento_id);
    const aceptar = async () => {
      const { error: errorAceptar } = await supabase
        .from('solicitudes')
        .update({ 'estado': 'aceptada' })
        .eq('id', id);

      if (errorAceptar) {
        console.log('Error updatingAceptarSolicitud:', errorAceptar);
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