'use client';

import { useEffect, useState } from 'react';
import ContainerOptions from '@/components/containers/ContainerOptions';
import styles from './reportes.module.css';
import ReportesTable from '@/components/recursos/reportes/ReportesTable';
import ActividadCard from '@/components/cards/Actividad';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';

type UserData = {
  id: string,
  nombre: string,
  apellido: string,
  email: string,
  image: string,
  horas_semanales: string,
  horas_restantes: string
};

export default function ReportesPage() {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const [totalHorasTrabajadas, setTotalHorasTrabajadas] = useState<string>('00:00');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [option, setOption] = useState('Esta semana');
  const [localizacion, setLocalizacion] = useState('all');
  const [reciente, setReciente] = useState(true);
  const [horasEquipo, setHorasEquipo] = useState(0);
  const [titulo, setTitulo] = useState('Horas semanales');
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
  const [tipoRegistros, setTipoRegistros] = useState('all');
  const isSelected = Object.values(checkedState).some((val) => val === true);

  useEffect(() => {
    const fetchData = async () => {

      let start = startDate;
      let end = endDate;


      if (!startDate || !endDate) {
        const now = dayjs();

        start = now.day(1).startOf('day').toDate();
        end = now.day(1).add(5, 'day').endOf('day').toDate();

        setStartDate(start);
        setEndDate(end);
      }

      const params = new URLSearchParams({
        option: option,
        startDate: start ? start.toISOString() : '',
        endDate: end ? end.toISOString() : '',
        reciente: reciente.toString(),
        //checkedState: JSON.stringify(checkedState),
      });


      const res = await fetch(`/api/reportes?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        console.error('Error en la respuesta:', res.status);
        return;
      }

      const result = await res.json();

      if (result.success) {
        setUsersData(result.users)
        setTotalHorasTrabajadas(result.totalHoras);
        setHorasEquipo(result.horasEquipo);
        const initialState = Object.fromEntries(result.users.map((user: UserData) => [user.id, false]));
        setCheckedState(initialState);
        setTitulo(result.tituloHoras)
      }
    };

    fetchData();
  }, [option]);

  function handleExportExcel() {
    const exportar = async () => {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Fichajes');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Apellido', key: 'apellido', width: 30 },
        { header: 'Email', key: 'email', width: 35 },
        { header: 'Horas semanales', key: 'horas_semanales', width: 30 },
        { header: 'Horas restantes', key: 'horas_restantes', width: 30 }
      ];

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const selectedProfiles = Object.keys(checkedState)
        .filter((key) => checkedState[parseInt(key)])
        .map((key) => String(key));

      if (selectedProfiles.length > 0) {
        const showProfiles = usersData.filter((user) => selectedProfiles.includes(String(user.id)));

        const data = showProfiles.map(item => [
          item.id?.toString() ?? '',
          item.nombre?.toString() ?? '',
          item.apellido?.toString() ?? '',
          item.email?.toString() ?? '',
          item.horas_semanales?.toString() ?? '',
          item.horas_restantes?.toString() ?? ''
        ]);

        data.forEach((item) => {
          worksheet.addRow(item)
        });

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(blob, 'Reportes.xlsx');
      }
    }

    exportar();
  }

  function handleExportPdf() {
    const exportar = async () => {

      const doc = new jsPDF();
      const headers = [['ID', 'Nombre', 'Apellio', 'Email', 'Horas semanales', 'Horas restantes']];


      const selectedProfiles = Object.keys(checkedState)
        .filter((key) => checkedState[parseInt(key)])
        .map((key) => String(key));

      if (selectedProfiles.length > 0) {
        const showProfiles = usersData.filter((user) => selectedProfiles.includes(String(user.id)));

        const data = showProfiles.map((item) => [
          item.id,
          item.nombre,
          item.apellido,
          item.email,
          item.horas_semanales,
          item.horas_restantes
        ]);

        doc.setFontSize(16);
        doc.text('Fichajes', 14, 20);

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
            0: { cellWidth: 30 },
            1: { cellWidth: 30 },
            2: { halign: 'center', cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 30 },
            5: { cellWidth: 30 }
          },
          margin: { top: 10, bottom: 10 },
        });

        doc.save('Fichajes.pdf');

      }
    };

    exportar();
  }

  function handleSelectAll() {
    const allChecked = Object.values(checkedState).every(Boolean);
    const newState = Object.fromEntries(
      Object.keys(checkedState).map(id => [id, !allChecked])
    );
    setCheckedState(newState);
    //console.log(newState);
  };

  return (
    <div className={styles.container}>
      <ActividadCard horas={totalHorasTrabajadas} total={horasEquipo} />
      <div className={styles.options}>
        {
          isSelected &&
          <div>
            <input type="checkbox" onChange={handleSelectAll} checked/>
            <label> {Object.values(checkedState).filter((val) => val === true).length} seleccionados</label>
          </div>
        }
        <div style={{ display: 'flex', gap: '30px' }}>
          <button onClick={handleExportPdf} style={{ cursor: isSelected ? 'pointer' : 'not-allowed' }} >
            <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.395 8.68889V14.3464C14.395 14.5965 14.2922 14.8363 14.1094 15.0131C13.9265 15.19 13.6785 15.2893 13.4199 15.2893H4.64404C4.38543 15.2893 4.13741 15.19 3.95454 15.0131C3.77168 14.8363 3.66895 14.5965 3.66895 14.3464V8.68889C3.66895 8.43881 3.77168 8.19898 3.95454 8.02215C4.13741 7.84531 4.38543 7.74597 4.64404 7.74597H6.10668C6.23598 7.74597 6.35999 7.79564 6.45143 7.88406C6.54286 7.97247 6.59423 8.09239 6.59423 8.21743C6.59423 8.34247 6.54286 8.46239 6.45143 8.5508C6.35999 8.63922 6.23598 8.68889 6.10668 8.68889H4.64404V14.3464H13.4199V8.68889H11.9572C11.8279 8.68889 11.7039 8.63922 11.6125 8.5508C11.5211 8.46239 11.4697 8.34247 11.4697 8.21743C11.4697 8.09239 11.5211 7.97247 11.6125 7.88406C11.7039 7.79564 11.8279 7.74597 11.9572 7.74597H13.4199C13.6785 7.74597 13.9265 7.84531 14.1094 8.02215C14.2922 8.19898 14.395 8.43881 14.395 8.68889ZM6.93917 6.19369L8.54441 4.64082V10.1033C8.54441 10.2283 8.59578 10.3482 8.68721 10.4366C8.77864 10.5251 8.90265 10.5747 9.03196 10.5747C9.16126 10.5747 9.28527 10.5251 9.37671 10.4366C9.46814 10.3482 9.51951 10.2283 9.51951 10.1033V4.64082L11.1248 6.19369C11.2162 6.28216 11.3403 6.33185 11.4697 6.33185C11.5991 6.33185 11.7231 6.28216 11.8146 6.19369C11.9061 6.10523 11.9575 5.98524 11.9575 5.86013C11.9575 5.73502 11.9061 5.61504 11.8146 5.52658L9.3769 3.16928C9.33162 3.12544 9.27785 3.09067 9.21866 3.06694C9.15947 3.04322 9.09603 3.03101 9.03196 3.03101C8.96789 3.03101 8.90445 3.04322 8.84526 3.06694C8.78607 3.09067 8.7323 3.12544 8.68702 3.16928L6.24929 5.52658C6.1578 5.61504 6.10641 5.73502 6.10641 5.86013C6.10641 5.98524 6.1578 6.10523 6.24929 6.19369C6.34077 6.28216 6.46485 6.33185 6.59423 6.33185C6.7236 6.33185 6.84768 6.28216 6.93917 6.19369Z" fill="#285FF5" />
            </svg>
            Exportar valores PDF
          </button>

          <button onClick={handleExportExcel} style={{ cursor: isSelected ? 'pointer' : 'not-allowed' }} >
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

      <ReportesTable users={usersData} totalHorasTrabajadas={totalHorasTrabajadas} checkedState={checkedState} setCheckedState={setCheckedState} titulo={titulo} />
    </div>
  );
}
