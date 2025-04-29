import { createClient } from '@/utils/supabase/server';
import styles from './layout.module.css'
import { redirect } from 'next/navigation';
import NavbarPerfil from '@/components/perfil/NavbarPerfil';
import ContainerSuperior from '@/components/containers/containerSuperior/ContainerSuperior';
import Navbar from '@/components/navbar/Navbar';
import ActividadCard from '@/components/cards/Actividad';

export default async function PerfilLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  let totalHoras = 0;
  let totalHorasNetas = 0;

  if (!user) {
    redirect('/login')
  }

  const { data: dataProfile, error: errorProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id);

  if (errorProfile) {
    console.log('Error fetching profiles: ', errorProfile);
  }

  let profile = [];

  if (dataProfile && dataProfile.length > 0) {
    profile = dataProfile && dataProfile.length > 0 ? dataProfile : [];
  } else {
    await supabase.auth.signOut();
    redirect('/login')
  }

  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const startDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

  const endDate = new Date(startDate);
  endDate.setUTCDate(startDate.getUTCDate() + 1);

  const { data: dataFichaje, error: errorFichaje } = await supabase
    .from('fichaje_jornada')
    .select('*')
    .gte('date', startDate.toISOString())
    .lt('date', endDate.toISOString())
    .eq('profile_id', profile[0].id);

  if (errorFichaje) {
    console.log('Error fetching fichaje: ', errorFichaje);
  }

  const fichaje = dataFichaje && dataFichaje.length > 0 ? dataFichaje : [];

  let eventos = [];

  if (fichaje && fichaje.length > 0) {
    const { data: dataEventos, error: errorEventos } = await supabase
      .from('fichaje_eventos')
      .select('*')
      .eq('fichaje_id', fichaje[0].id)

    if (errorEventos) {
      console.log('Error fetching Eventos: ', errorEventos);
    }

    eventos = dataEventos && dataEventos.length > 0 ? dataEventos : [];
  }

  const dateCard = new Date();
  const startOfWeek = new Date(dateCard);
  const dayCard = startOfWeek.getDay();
  const diffToMonday = dayCard === 0 ? -6 : 1 - dayCard;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 5);
  endOfWeek.setHours(0, 0, 0, 0);


  const { data: dataFichajeCard, error: errorFichajeCard } = await supabase
    .from('fichaje_jornada')
    .select('*')
    .gte('date', startDate.toISOString())
    .lt('date', endDate.toISOString())
    .eq('profile_id', profile[0].id);

  if (dataFichajeCard && dataFichajeCard.length > 0) {
    for (const jornada of dataFichajeCard) {
      const { data: eventos } = await supabase
        .from('fichaje_eventos')
        .select('evento, date')
        .eq('fichaje_id', jornada.id)
        .order('date', { ascending: true });

      if (eventos && eventos.length > 0) {
        let inicioJornada: Date | null = null;
        let finJornada: Date | null = null;
        let pausaInicio: Date | null = null;
        let totalPausas = 0;

        for (const evento of eventos) {
          const hora = new Date(evento.date);

          if (evento.evento === 'Inicio Jornada' && !inicioJornada) {
            inicioJornada = hora;
          } else if (evento.evento === 'Jornada Finalizada') {
            finJornada = hora;
          } else if (evento.evento === 'Inicio Pausa') {
            pausaInicio = hora;
          } else if (evento.evento === 'Final Pausa' && pausaInicio && hora) {
            totalPausas += (hora.getTime() - pausaInicio.getTime()) / 1000 / 60 / 60;
            pausaInicio = null;
          }
        }

        if (inicioJornada && finJornada && finJornada > inicioJornada) {
          const duracionJornada = (finJornada.getTime() - inicioJornada.getTime()) / 1000 / 60 / 60;
          const horasNetas = duracionJornada - totalPausas;
          totalHorasNetas += horasNetas;
          totalHoras += horasNetas;
        }
      }
    }
  }

  function formatHoras(horasDecimales: number): string {
    const horas = Math.floor(horasDecimales);
    const minutos = Math.round((horasDecimales - horas) * 60);
    return `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}`;
  }




  return (
    <>
      <Navbar image={profile[0].image} title='Perfil' />
      <ContainerSuperior profile={profile} fichaje={fichaje} eventos={eventos} />

      <div style={{ display: 'flex', width: '100%' }}>
        <ActividadCard horas={formatHoras(totalHoras)} total={profile[0].horas_semana} />
      </div>

      <div className={styles.content}>
        <NavbarPerfil />
        <div className={styles.mainContent}>
          {children}
        </div>
      </div>

    </>
  );
}
