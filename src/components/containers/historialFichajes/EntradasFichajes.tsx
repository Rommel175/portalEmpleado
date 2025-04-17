import { Fichaje_eventos, Profile } from '@/types/Types';
import EntradaFichajesItem from './EntradaFichajesItem';
import styles from './entradasFichajes.module.css';
import { createClient } from '@/utils/supabase/server';

export default async function EntradasFichajes({ date, profile }: { date: string, profile: Profile[] }) {

  const supabase = await createClient();

  const fichajes: Fichaje_eventos[] = [];

  const { data: dataFichaje, error: errorFichaje } = await supabase
    .from('fichaje_jornada')
    .select('*')
    .eq('profile_id', profile[0].id)
    .eq('date::date', date)

  if (errorFichaje) {
    console.log('Error fetching fichajes: ', errorFichaje)
  }

  if (dataFichaje && dataFichaje.length > 0) {

    for (let i = 0; i < dataFichaje.length; i++) {
      const { data: dataEvento, error: errorEvento } = await supabase
        .from('fichaje_eventos')
        .select('*')
        .eq('fichaje_id', dataFichaje[i].id);

      if (errorEvento) {
        console.log('Error fetching Evento: ', errorEvento);
      }

      if (dataEvento && dataEvento.length > 0) {
        const eventosData = dataEvento.map(item => ({
          id: item.id,
          fichaje_id: item.fichaje_id,
          evento: item.evento,
          date: new Date(item.date),
          localizacion: item.localizacion
        }));

        fichajes.push(...eventosData);
      }
    }
  }

  function tiempoTotal(fichajes: { evento: string, date: Date }[]) {
    const parseHour = (date: Date) => {
      const dateHora = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const partesHora = dateHora.split(':');
      const horas = Number(partesHora[0]);
      const minutos = Number(partesHora[1]);
      const segundos = Number(partesHora[2]);
      return (horas * 3600) + (minutos * 60) + segundos;
    };

    let totalSegundos = 0;
    let inicio: number | null = null;

    for (const f of fichajes) {
      if (f.evento === "Inicio Jornada") {
        inicio = parseHour(f.date);
      } else if (f.evento === "Jornada Finalizada" && inicio !== null) {
        const fin = parseHour(f.date);
        totalSegundos += fin - inicio;
        inicio = null;
      }
    }

    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}h`;
  }

function parseHora(hora: string | Date): string {
  const date = typeof hora === 'string' ? new Date(hora) : hora;
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function parseFecha(fecha: string | Date): string {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return date.toISOString().slice(0,10);
}

return (
  <div className={styles.container}>
    <header className={styles.title}>
      <h2> {parseFecha(date)} </h2>
      <div>
        <h2>Total:</h2>
        <h2>{tiempoTotal(fichajes)}</h2>
        <svg className={styles.svg} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.3955 8.46672V14.1242C14.3955 14.3743 14.2927 14.6141 14.1099 14.791C13.927 14.9678 13.679 15.0672 13.4204 15.0672H4.64453C4.38592 15.0672 4.1379 14.9678 3.95503 14.791C3.77217 14.6141 3.66943 14.3743 3.66943 14.1242V8.46672C3.66943 8.21664 3.77217 7.97681 3.95503 7.79998C4.1379 7.62315 4.38592 7.5238 4.64453 7.5238H6.10717C6.23647 7.5238 6.36048 7.57347 6.45191 7.66189C6.54335 7.75031 6.59471 7.87022 6.59471 7.99526C6.59471 8.1203 6.54335 8.24022 6.45191 8.32863C6.36048 8.41705 6.23647 8.46672 6.10717 8.46672H4.64453V14.1242H13.4204V8.46672H11.9577C11.8284 8.46672 11.7044 8.41705 11.613 8.32863C11.5215 8.24022 11.4702 8.1203 11.4702 7.99526C11.4702 7.87022 11.5215 7.75031 11.613 7.66189C11.7044 7.57347 11.8284 7.5238 11.9577 7.5238H13.4204C13.679 7.5238 13.927 7.62315 14.1099 7.79998C14.2927 7.97681 14.3955 8.21664 14.3955 8.46672ZM6.93965 5.97152L8.5449 4.41865V9.8811C8.5449 10.0061 8.59627 10.1261 8.6877 10.2145C8.77913 10.3029 8.90314 10.3526 9.03245 10.3526C9.16175 10.3526 9.28576 10.3029 9.3772 10.2145C9.46863 10.1261 9.51999 10.0061 9.51999 9.8811V4.41865L11.1252 5.97152C11.2167 6.05999 11.3408 6.10969 11.4702 6.10969C11.5996 6.10969 11.7236 6.05999 11.8151 5.97152C11.9066 5.88306 11.958 5.76307 11.958 5.63797C11.958 5.51286 11.9066 5.39287 11.8151 5.30441L9.37739 2.94711C9.33211 2.90328 9.27834 2.8685 9.21915 2.84478C9.15996 2.82105 9.09652 2.80884 9.03245 2.80884C8.96838 2.80884 8.90493 2.82105 8.84575 2.84478C8.78656 2.8685 8.73279 2.90328 8.68751 2.94711L6.24977 5.30441C6.15829 5.39287 6.1069 5.51286 6.1069 5.63797C6.1069 5.76307 6.15829 5.88306 6.24977 5.97152C6.34126 6.05999 6.46534 6.10969 6.59471 6.10969C6.72409 6.10969 6.84817 6.05999 6.93965 5.97152Z" fill="#7B8794" />
        </svg>
      </div>
    </header>

    {
      fichajes.map((item, index) => {
        return <EntradaFichajesItem key={index} action={item.evento} date={date} hour={parseHora(item.date)} localizacion={item.localizacion} />
      })
    }
  </div>
);
}