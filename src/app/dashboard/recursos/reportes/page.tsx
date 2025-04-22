import ContainerOptions from '@/components/containers/ContainerOptions';
import styles from './reportes.module.css'
import ReportesTable from '@/components/recursos/reportes/ReportesTable';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

type UserData = {
  id: string,
  nombre: string,
  apellido: string,
  email: string
  image: string,
  horas_semanales: string,
  horas_restantes: string
}

export default async function ReportesPage() {
  const date = new Date();

  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 5);
  endOfWeek.setHours(0, 0, 0, 0)

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect('/login')
  }

  const { data: dataProfile, error: errorProfile } = await supabase
    .from('profiles')
    .select('*')
    .neq('user_id', user.id);

  if (errorProfile) {
    console.log('Error fetching profiles: ', errorProfile);
  }

  let profiles = [];

  if (dataProfile && dataProfile.length > 0) {
    profiles = dataProfile && dataProfile.length > 0 ? dataProfile : [];
  } else {
    await supabase.auth.signOut();
    redirect('/login')
  }

  const usersData: UserData[] = [];
  let totalHorasTrabajadas = 0;

  for (let i = 0; i < profiles.length; i++) {
    const profile = profiles[i];

    const { data: fichajeJornada, error: errorFichajeJornada } = await supabase
      .from('fichaje_jornada')
      .select('*')
      .eq('profile_id', profile.id)
      .gte('date', startOfWeek.toISOString())
      .lt('date', endOfWeek.toISOString());

    if (errorFichajeJornada) {
      console.log('Error fetching Fichajes Jornada: ', errorFichajeJornada);
    }

    let totalHorasNetas = 0;

    if (fichajeJornada && fichajeJornada.length > 0) {
      for (const jornada of fichajeJornada) {
        const { data: eventos, error: errorEventos } = await supabase
          .from('fichaje_eventos')
          .select('evento, date')
          .eq('fichaje_id', jornada.id)
          .order('date', { ascending: true });

        if (errorEventos) {
          console.log('Error fetching Eventos: ', errorEventos);
        }

        if (eventos && eventos.length > 0) {
          let inicioJornada = null;
          let finJornada = null;
          let pausaInicio = null;
          let totalPausas = 0;

          for (const evento of eventos) {
            const hora = new Date(evento.date);

            if (evento.evento === 'Inicio Jornada' && !inicioJornada) {
              inicioJornada = hora;
            } else if (evento.evento === 'Jornada Finalizada') {
              finJornada = hora;
            } else if (evento.evento === 'Inicio Pausa') {
              pausaInicio = hora;
            } else if (evento.evento === 'Final Pausa' && pausaInicio instanceof Date && hora instanceof Date) {
              totalPausas += (hora.getTime() - pausaInicio.getTime()) / 1000 / 60 / 60;
              pausaInicio = null;
            }
          }

          if (inicioJornada instanceof Date && finJornada instanceof Date && finJornada > inicioJornada) {
            const duracionJornada = (finJornada.getTime() - inicioJornada.getTime()) / 1000 / 60 / 60;
            const horasNetas = duracionJornada - totalPausas;
            totalHorasNetas += horasNetas;
            totalHorasTrabajadas += horasNetas;
          }
        }
      }
    }

    const horasRestantes = profile.horas_semana - totalHorasNetas;

    usersData.push({
      id: profile.id,
      nombre: profile.nombre,
      apellido: profile.apellido,
      email: profile.email,
      image: profile.image,
      horas_semanales: formatHoras(profile.horas_semana),
      horas_restantes: formatHoras(parseFloat(horasRestantes.toFixed(2)))
    });
  }

  function formatHoras(horasDecimales: number): string {
    const horas = Math.floor(horasDecimales);  
    const minutos = Math.round((horasDecimales - horas) * 60);
    return `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}`;
  }
  





  return (
    <div className={styles.container}>
      <ContainerOptions ubicacion={false} tipoRegistro={false} urlExportar='#' recientes={false} añadirUsuario={false} />
      <ReportesTable users={usersData} totalHorasTrabajadas={formatHoras(totalHorasTrabajadas)} />
    </div>
  );
}