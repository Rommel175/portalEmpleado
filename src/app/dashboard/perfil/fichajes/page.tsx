'use client'

import { useState, useEffect } from 'react';
import ContainerOptions from '@/components/containers/ContainerOptions';
import EntradasFichajes from '@/components/containers/historialFichajes/EntradasFichajes';
import styles from './fichajes.module.css'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Profile } from '@/types/Types';

type EventosPorFechaType = {
  fecha: string;
  eventos: Evento[];
};

type Evento = {
  id: number;
  fichaje_id: number;
  evento: string;
  date: Date;
  localizacion: string;
};

export default function Fichajes() {

  const [eventosPorFecha, setEventosPorFecha] = useState<EventosPorFechaType[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  const [reciente, setReciente] = useState(true);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {

    let start = startDate;
    let end = endDate;

    if (!startDate || !endDate) {
      const now = new Date();
      start = new Date(now);
      const day = start.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      start.setDate(start.getDate() + diffToMonday);

      end = new Date(start);
      end.setDate(start.getDate() + 5);

      setStartDate(start);
      setEndDate(end);
    }

    const fetchData = async () => {

      const params = new URLSearchParams({
        option: option,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
        reciente: reciente.toString(),
        localizacion: localizacion,
      });


      const res = await fetch(`/api/fichajes?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        console.error('Error en la respuesta:', res.status);
        return;
      }

      const result = await res.json();

      if (result.success) {
        //console.log(result.data)
        setEventosPorFecha(result.data)
        setProfile(result.profile)
      }

      //console.log(result.data[0].eventos[0].evento);
    }

    fetchData();
  }, [option, localizacion, reciente])

  function handleExportExcel() {
    const exportar = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Fichajes');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Fichaje_id', key: 'fichaje_id', width: 30 },
        { header: 'Evento', key: 'evento', width: 30 },
        { header: 'Fecha', key: 'date', width: 65 },
        { header: 'Localizacion', key: 'localizacion', width: 30 }
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      eventosPorFecha.forEach(({ eventos }) => {
        eventos.forEach(evento => {
          worksheet.addRow({
            id: evento.id,
            fichaje_id: evento.fichaje_id,
            evento: evento.evento,
            date: new Date(evento.date).toLocaleString(),
            localizacion: evento.localizacion,
          });
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, `fichajes-${startDate?.toISOString().slice(0, 10)}/${endDate?.toISOString().slice(0, 10)}-${profile?.nombre || ''}${profile?.apellido || ''}.xlsx`);
    }

    exportar();
  }

  function handleExportPdf() {
    const doc = new jsPDF();
    const headers = [['ID', 'Fichaje_id', 'Evento', 'Fecha', 'Localizacion']];
    const data = eventosPorFecha.flatMap(({ eventos }) =>
      eventos.map((e) => [
        e.id.toString(),
        e.fichaje_id.toString(),
        e.evento.toString(),
        e.date.toString(),
        e.localizacion.toString()
      ])
    );    

    doc.setFontSize(16);
    doc.text('Historial de Fichajes', 14, 20);

    autoTable(doc, {
      head: headers,
      body: data,
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
        0: { cellWidth: 20 },
        3: { halign: 'right' },
      },
      margin: { top: 10, bottom: 10 },
    });

    doc.save(`fichajes-${startDate?.toISOString().slice(0, 10)}/${endDate?.toISOString().slice(0, 10)}-${profile?.nombre || ''}${profile?.apellido || ''}.pdf`);
  }

  return (
    <>
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
          tipoRegistro={true}
          ubicacion={true}
          date={true}
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

      {
        eventosPorFecha.length == 0 ? (
          <p>No hay registros.</p>
        ) : (

          eventosPorFecha.map((item) => (
            <EntradasFichajes
              key={item.fecha}
              date={item.fecha}
              eventos={item.eventos}
            />
          ))
        )
      }

    </>
  );
}
