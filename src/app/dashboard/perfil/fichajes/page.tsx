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
import dayjs from 'dayjs';
import ActividadCardIndividual from '@/components/cards/ActividadIndividual';
import DropdownExportar from '@/components/customInputs/dropfownExportar/DropdownExportar';

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

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  const [reciente, setReciente] = useState(true);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const [tipoRegistros, setTipoRegistros] = useState('all');

  const [eventosPorFecha, setEventosPorFecha] = useState<EventosPorFechaType[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [totalHorasTrabajadas, setTotalHorasTrabajadas] = useState<string>('00:00');
  const [totalHoras, setTotalHoras] = useState(0);

  useEffect(() => {
    let start = startDate;
    let end = endDate;


    if (!startDate || !endDate) {
      const now = dayjs();

      start = now.day(1).startOf('day').toDate();
      end = now.day(1).add(5, 'day').endOf('day').toDate();

      setStartDate(start);
      setEndDate(end);
    }

    const fetchData = async () => {

      const params = new URLSearchParams({
        option: option,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
        reciente: reciente ? 'true' : 'false',
        localizacion: localizacion,
        tipoRegistro: tipoRegistros
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
        setEventosPorFecha(result.data)
        setProfile(result.profile)
        setTotalHoras(result.horas_semana);
      }
    }

    fetchData();
  }, [option, localizacion, reciente, tipoRegistros])

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
            date: dayjs(evento.date).toLocaleString(),
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
      {profile && (
        <ActividadCardIndividual
          totalHoras={totalHoras}
          setTotalHorasTrabajadas={setTotalHorasTrabajadas}
          totalHorasTrabajadas={totalHorasTrabajadas}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          localizacion={localizacion}
          setLocalizacion={setLocalizacion}
          option={option}
          setOption={setOption}
          id={profile.id}
        />
      )}
      <div className={styles.options}>
        <DropdownExportar eventos={eventosPorFecha} startDate={startDate} endDate={endDate}/>

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
          tipoRegistros={tipoRegistros}
          setTipoRegistros={setTipoRegistros}
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
