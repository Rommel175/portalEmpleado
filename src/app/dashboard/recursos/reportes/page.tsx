'use client';

import { useEffect, useState } from 'react';
import ContainerOptions from '@/components/containers/ContainerOptions';
import styles from './reportes.module.css';
import ReportesTable from '@/components/recursos/reportes/ReportesTable';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import ActividadCard from '@/components/cards/Actividad';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Fichaje_eventos } from '@/types/Types';

type UserData = {
  id: string,
  nombre: string,
  apellido: string,
  email: string,
  image: string,
  horas_semanales: string,
  horas_restantes: string
};

type ExportType = {
  id: string,
  nombre: string,
  apellido: string,
  eventos: Fichaje_eventos[]
}

type PdfType = {
  nombre: string,
  apellido: string,
  fecha: string,
  evento: string,
  localizacion: string
}

export default function ReportesPage() {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [totalHorasTrabajadas, setTotalHorasTrabajadas] = useState<string>('00:00');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  const [reciente, setReciente] = useState(true);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const [horasEquipo, setHorasEquipo] = useState(0);
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id);

      if (errorProfile) {
        console.error('Error fetching profiles: ', errorProfile);
        return;
      }

      if (!dataProfile || dataProfile.length === 0) {
        await supabase.auth.signOut();
        router.push('/login');
        return;
      }

      const date = new Date();
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 5);
      endOfWeek.setHours(0, 0, 0, 0);

      let totalHoras = 0;
      let horasEquipo = 0;
      const users: UserData[] = [];

      const selectedProfiles = Object.keys(checkedState)
        .filter((key) => checkedState[parseInt(key)])
        .map((key) => parseInt(key));

      const showProfiles = selectedProfiles.length === 0 ? dataProfile : dataProfile.filter((profile) =>
        selectedProfiles.includes(profile.id)
      );

      for (const profile of showProfiles) {
        horasEquipo += profile.horas_semana;
        const { data: fichajeJornada } = await supabase
          .from('fichaje_jornada')
          .select('*')
          .eq('profile_id', profile.id)
          .gte('date', startOfWeek.toISOString())
          .lt('date', endOfWeek.toISOString());

        let totalHorasNetas = 0;

        if (fichajeJornada && fichajeJornada.length > 0) {
          for (const jornada of fichajeJornada) {
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

        const horasRestantes = profile.horas_semana - totalHorasNetas;

        users.push({
          id: profile.id,
          nombre: profile.nombre,
          apellido: profile.apellido,
          email: profile.email,
          image: profile.image,
          horas_semanales: formatHoras(profile.horas_semana),
          horas_restantes: formatHoras(parseFloat(horasRestantes.toFixed(2)))
        });
      }

      console.log(horasEquipo)

      setUsersData(users);
      setTotalHorasTrabajadas(formatHoras(totalHoras));
      setHorasEquipo(horasEquipo);
    };

    fetchData();
  }, [checkedState]);

  function handleExportExcel() {
    const exportar = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user?.id);

      if (errorProfile) {
        console.log('Error fetching profiles: ', errorProfile);
        return;
      }

      function rangosPresets() {
        const now = new Date();
        let start = new Date(now);
        let end = new Date(now);

        switch (option) {
          case 'Esta semana':
            const day = start.getDay();
            const diffToMonday = day === 0 ? -6 : 1 - day;
            start.setDate(start.getDate() + diffToMonday);
            end = new Date(start);
            end.setDate(start.getDate() + 5);
            break;
          case 'Hoy':
          case 'Ayer':
            if (!startDate) return [start, end];
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(end.getDate() + 1);
            break;
          case 'Semana pasada':
          case 'Este mes':
          case 'Mes pasado':
          case 'Este año':
          case 'Año pasado':
            if (!startDate || !endDate) return [start, end];
            start = new Date(startDate);
            end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            break;
        }

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return [start, end];
      }

      const [start, end] = rangosPresets();
      const excelData: ExportType[] = [];

      if (dataProfile && dataProfile.length > 0) {
        const selectedProfiles = Object.keys(checkedState)
          .filter((key) => checkedState[parseInt(key)])
          .map((key) => parseInt(key));

        const showProfiles = selectedProfiles.length === 0 ? dataProfile : dataProfile.filter((profile) =>
          selectedProfiles.includes(profile.id)
        );

        for (const profile of showProfiles) {
          const { data: jornadaData, error: jornadaError } = await supabase
            .from('fichaje_jornada')
            .select('*')
            .eq('profile_id', profile.id)
            .gte('date', start.toISOString())
            .lt('date', end.toISOString())
            .order('date', { ascending: !reciente });

          if (jornadaError) {
            console.log('Error fetching Jornada: ', jornadaError);
            continue;
          }

          const eventosTotales: Fichaje_eventos[] = [];

          if (jornadaData && jornadaData.length > 0) {
            for (const jornada of jornadaData) {
              if (localizacion == 'all') {
                const { data: dataEvento, error: errorEvento } = await supabase
                  .from('fichaje_eventos')
                  .select('*')
                  .eq('fichaje_id', jornada.id)
                  .order('date', { ascending: true });

                if (errorEvento) {
                  console.log('Error fetching Evento: ', errorEvento);
                  continue;
                }

                if (dataEvento && dataEvento.length > 0) {
                  dataEvento.forEach((evento) => {
                    eventosTotales.push({
                      date: evento.date,
                      evento: evento.evento,
                      localizacion: evento.localizacion,
                      id: evento.id,
                      fichaje_id: evento.fichaje_id
                    });
                  });
                }
              } else {
                const { data: dataEvento, error: errorEvento } = await supabase
                  .from('fichaje_eventos')
                  .select('*')
                  .eq('fichaje_id', jornada.id)
                  .order('date', { ascending: true })
                  .eq('localizacion', localizacion);

                if (errorEvento) {
                  console.log('Error fetching Evento: ', errorEvento);
                  continue;
                }

                if (dataEvento && dataEvento.length > 0) {
                  dataEvento.forEach((evento) => {
                    eventosTotales.push({
                      date: evento.date,
                      evento: evento.evento,
                      localizacion: evento.localizacion,
                      id: evento.id,
                      fichaje_id: evento.fichaje_id
                    });
                  });
                }
              }
            }
          }

          excelData.push({
            id: profile.id,
            nombre: profile.nombre,
            apellido: profile.apellido,
            eventos: eventosTotales
          });
        }
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Fichajes');

      worksheet.columns = [
        { header: 'Nombre', key: 'nombre', width: 25 },
        { header: 'Apellido', key: 'apellido', width: 25 },
        { header: 'Fecha', key: 'fecha', width: 65 },
        { header: 'Evento', key: 'evento', width: 25 },
        { header: 'Localizacion', key: 'Localizacion', width: 25 }
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      let currentRow = 2;

      excelData.forEach((user) => {
        user.eventos.forEach((fichaje, index) => {
          worksheet.getCell(`A${currentRow}`).value = index === 0 ? user.nombre ?? '' : '';
          worksheet.getCell(`B${currentRow}`).value = index === 0 ? user.apellido ?? '' : '';
          worksheet.getCell(`C${currentRow}`).value = new Date(fichaje.date).toString();
          worksheet.getCell(`D${currentRow}`).value = fichaje.evento;
          worksheet.getCell(`E${currentRow}`).value = fichaje.localizacion;
          currentRow++;
        });

        currentRow++;
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, 'Fichajes.xlsx');
    };

    exportar();
  }

  function handleExportPdf() {
    const exportar = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: dataProfile, error: errorProfile } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user?.id);

      if (errorProfile) {
        console.log('Error fetching profiles: ', errorProfile);
        return;
      }

      function rangosPresets() {
        const now = new Date();
        let start = new Date(now);
        let end = new Date(now);

        switch (option) {
          case 'Esta semana':
            const day = start.getDay();
            const diffToMonday = day === 0 ? -6 : 1 - day;
            start.setDate(start.getDate() + diffToMonday);
            end = new Date(start);
            end.setDate(start.getDate() + 5);
            break;
          case 'Hoy':
          case 'Ayer':
            if (!startDate) return [start, end];
            start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(end.getDate() + 1);
            break;
          case 'Semana pasada':
          case 'Este mes':
          case 'Mes pasado':
          case 'Este año':
          case 'Año pasado':
            if (!startDate || !endDate) return [start, end];
            start = new Date(startDate);
            end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            break;
        }

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return [start, end];
      }

      const [start, end] = rangosPresets();
      const excelData: ExportType[] = [];

      if (dataProfile && dataProfile.length > 0) {
        const selectedProfiles = Object.keys(checkedState)
          .filter((key) => checkedState[parseInt(key)])
          .map((key) => parseInt(key));

        const showProfiles = selectedProfiles.length === 0 ? dataProfile : dataProfile.filter((profile) =>
          selectedProfiles.includes(profile.id)
        );

        for (const profile of showProfiles) {
          const { data: jornadaData, error: jornadaError } = await supabase
            .from('fichaje_jornada')
            .select('*')
            .eq('profile_id', profile.id)
            .gte('date', start.toISOString())
            .lt('date', end.toISOString())
            .order('date', { ascending: !reciente });

          if (jornadaError) {
            console.log('Error fetching Jornada: ', jornadaError);
            continue;
          }

          const eventosTotales: Fichaje_eventos[] = [];

          if (jornadaData && jornadaData.length > 0) {
            for (const jornada of jornadaData) {
              if (localizacion == 'all') {
                const { data: dataEvento, error: errorEvento } = await supabase
                  .from('fichaje_eventos')
                  .select('*')
                  .eq('fichaje_id', jornada.id)
                  .order('date', { ascending: true });

                if (errorEvento) {
                  console.log('Error fetching Evento: ', errorEvento);
                  continue;
                }

                if (dataEvento && dataEvento.length > 0) {
                  dataEvento.forEach((evento) => {
                    eventosTotales.push({
                      date: evento.date,
                      evento: evento.evento,
                      localizacion: evento.localizacion,
                      id: evento.id,
                      fichaje_id: evento.fichaje_id
                    });
                  });
                }
              } else {
                const { data: dataEvento, error: errorEvento } = await supabase
                  .from('fichaje_eventos')
                  .select('*')
                  .eq('fichaje_id', jornada.id)
                  .order('date', { ascending: true })
                  .eq('localizacion', localizacion);

                if (errorEvento) {
                  console.log('Error fetching Evento: ', errorEvento);
                  continue;
                }

                if (dataEvento && dataEvento.length > 0) {
                  dataEvento.forEach((evento) => {
                    eventosTotales.push({
                      date: evento.date,
                      evento: evento.evento,
                      localizacion: evento.localizacion,
                      id: evento.id,
                      fichaje_id: evento.fichaje_id
                    });
                  });
                }
              }
            }
          }

          excelData.push({
            id: profile.id,
            nombre: profile.nombre,
            apellido: profile.apellido,
            eventos: eventosTotales
          });
        }
      }

      const doc = new jsPDF();
      const headers = [['Nombre', 'Apellido', 'Fecha', 'Evento', 'Localizacion']];
      const dataPfd: PdfType[] = [];

      excelData.forEach((user) => {
        user.eventos.forEach((fichaje) => {
          dataPfd.push({
            nombre: user.nombre,
            apellido: user.apellido,
            fecha: new Date(fichaje.date).toString(),
            evento: fichaje.evento,
            localizacion: fichaje.localizacion
          })
        })
      });

      doc.setFontSize(16);
      doc.text('Fichajes', 14, 20);

      autoTable(doc, {
        head: headers,
        body: dataPfd.map(item => [item.nombre, item.apellido, item.fecha, item.evento, item.localizacion]),
        startY: 30,
        theme: 'striped',
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 10,
          halign: 'center',
          valign: 'middle',
          cellPadding: 4,
          lineColor: [200, 200, 200],
          lineWidth: 0.5,
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 30 },
          2: { halign: 'center', cellWidth: 60},
          3: { cellWidth: 30 },
          4: { cellWidth: 30 }
        },
        margin: { top: 10, bottom: 10 },
      });

      doc.save('Fichajes.pdf');



    };

    exportar();
  }

  function formatHoras(horasDecimales: number): string {
    const horas = Math.floor(horasDecimales);
    const minutos = Math.round((horasDecimales - horas) * 60);
    return `${horas < 10 ? '0' + horas : horas}:${minutos < 10 ? '0' + minutos : minutos}`;
  }

  return (
    <div className={styles.container}>
      <ActividadCard horas={totalHorasTrabajadas} total={horasEquipo} />
      <div className={styles.options}>
        <div style={{ display: 'flex', gap: '30px' }}>
          <button onClick={handleExportPdf}>
            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.395 8.68889V14.3464C14.395 14.5965 14.2922 14.8363 14.1094 15.0131C13.9265 15.19 13.6785 15.2893 13.4199 15.2893H4.64404C4.38543 15.2893 4.13741 15.19 3.95454 15.0131C3.77168 14.8363 3.66895 14.5965 3.66895 14.3464V8.68889C3.66895 8.43881 3.77168 8.19898 3.95454 8.02215C4.13741 7.84531 4.38543 7.74597 4.64404 7.74597H6.10668C6.23598 7.74597 6.35999 7.79564 6.45143 7.88406C6.54286 7.97247 6.59423 8.09239 6.59423 8.21743C6.59423 8.34247 6.54286 8.46239 6.45143 8.5508C6.35999 8.63922 6.23598 8.68889 6.10668 8.68889H4.64404V14.3464H13.4199V8.68889H11.9572C11.8279 8.68889 11.7039 8.63922 11.6125 8.5508C11.5211 8.46239 11.4697 8.34247 11.4697 8.21743C11.4697 8.09239 11.5211 7.97247 11.6125 7.88406C11.7039 7.79564 11.8279 7.74597 11.9572 7.74597H13.4199C13.6785 7.74597 13.9265 7.84531 14.1094 8.02215C14.2922 8.19898 14.395 8.43881 14.395 8.68889ZM6.93917 6.19369L8.54441 4.64082V10.1033C8.54441 10.2283 8.59578 10.3482 8.68721 10.4366C8.77864 10.5251 8.90265 10.5747 9.03196 10.5747C9.16126 10.5747 9.28527 10.5251 9.37671 10.4366C9.46814 10.3482 9.51951 10.2283 9.51951 10.1033V4.64082L11.1248 6.19369C11.2162 6.28216 11.3403 6.33185 11.4697 6.33185C11.5991 6.33185 11.7231 6.28216 11.8146 6.19369C11.9061 6.10523 11.9575 5.98524 11.9575 5.86013C11.9575 5.73502 11.9061 5.61504 11.8146 5.52658L9.3769 3.16928C9.33162 3.12544 9.27785 3.09067 9.21866 3.06694C9.15947 3.04322 9.09603 3.03101 9.03196 3.03101C8.96789 3.03101 8.90445 3.04322 8.84526 3.06694C8.78607 3.09067 8.7323 3.12544 8.68702 3.16928L6.24929 5.52658C6.1578 5.61504 6.10641 5.73502 6.10641 5.86013C6.10641 5.98524 6.1578 6.10523 6.24929 6.19369C6.34077 6.28216 6.46485 6.33185 6.59423 6.33185C6.7236 6.33185 6.84768 6.28216 6.93917 6.19369Z" fill="#285FF5" />
            </svg>
            Exportar valores PDF
          </button>

          <button onClick={handleExportExcel}>
            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.395 8.68889V14.3464C14.395 14.5965 14.2922 14.8363 14.1094 15.0131C13.9265 15.19 13.6785 15.2893 13.4199 15.2893H4.64404C4.38543 15.2893 4.13741 15.19 3.95454 15.0131C3.77168 14.8363 3.66895 14.5965 3.66895 14.3464V8.68889C3.66895 8.43881 3.77168 8.19898 3.95454 8.02215C4.13741 7.84531 4.38543 7.74597 4.64404 7.74597H6.10668C6.23598 7.74597 6.35999 7.79564 6.45143 7.88406C6.54286 7.97247 6.59423 8.09239 6.59423 8.21743C6.59423 8.34247 6.54286 8.46239 6.45143 8.5508C6.35999 8.63922 6.23598 8.68889 6.10668 8.68889H4.64404V14.3464H13.4199V8.68889H11.9572C11.8279 8.68889 11.7039 8.63922 11.6125 8.5508C11.5211 8.46239 11.4697 8.34247 11.4697 8.21743C11.4697 8.09239 11.5211 7.97247 11.6125 7.88406C11.7039 7.79564 11.8279 7.74597 11.9572 7.74597H13.4199C13.6785 7.74597 13.9265 7.84531 14.1094 8.02215C14.2922 8.19898 14.395 8.43881 14.395 8.68889ZM6.93917 6.19369L8.54441 4.64082V10.1033C8.54441 10.2283 8.59578 10.3482 8.68721 10.4366C8.77864 10.5251 8.90265 10.5747 9.03196 10.5747C9.16126 10.5747 9.28527 10.5251 9.37671 10.4366C9.46814 10.3482 9.51951 10.2283 9.51951 10.1033V4.64082L11.1248 6.19369C11.2162 6.28216 11.3403 6.33185 11.4697 6.33185C11.5991 6.33185 11.7231 6.28216 11.8146 6.19369C11.9061 6.10523 11.9575 5.98524 11.9575 5.86013C11.9575 5.73502 11.9061 5.61504 11.8146 5.52658L9.3769 3.16928C9.33162 3.12544 9.27785 3.09067 9.21866 3.06694C9.15947 3.04322 9.09603 3.03101 9.03196 3.03101C8.96789 3.03101 8.90445 3.04322 8.84526 3.06694C8.78607 3.09067 8.7323 3.12544 8.68702 3.16928L6.24929 5.52658C6.1578 5.61504 6.10641 5.73502 6.10641 5.86013C6.10641 5.98524 6.1578 6.10523 6.24929 6.19369C6.34077 6.28216 6.46485 6.33185 6.59423 6.33185C6.7236 6.33185 6.84768 6.28216 6.93917 6.19369Z" fill="#285FF5" />
            </svg>
            Exportar valores EXCEL
          </button>
        </div>

        <ContainerOptions
          recientes={true}
          usuarios={true}
          date={true}
          ubicacion={true}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          option={option}
          setOption={setOption}
          localizacion={localizacion}
          setLocalizacion={setLocalizacion}
          reciente={reciente}
          setReciente={setReciente}
          checkedState={checkedState}
          setCheckedState={setCheckedState}
        />
      </div>

      <ReportesTable users={usersData} totalHorasTrabajadas={totalHorasTrabajadas} />
    </div>
  );
}
