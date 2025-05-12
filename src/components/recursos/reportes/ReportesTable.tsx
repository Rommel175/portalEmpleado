'use client'

//import { useState } from 'react';
import styles from './reportesTable.module.css'
import ReportesTableItem from './ReportesTableItem';
//import ExcelJS from 'exceljs';
//import { saveAs } from 'file-saver';

type UserData = {
  id: string,
  nombre: string,
  apellido: string,
  email: string
  image: string,
  horas_semanales: string,
  horas_restantes: string
}

export default function ReportesTable({ users, totalHorasTrabajadas, checkedState, setCheckedState, titulo }: { users: UserData[], totalHorasTrabajadas: string, checkedState: { [key: string]: boolean }, setCheckedState: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>, titulo: string }) {

  /*function handleExportExcel() {
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

      const data = users.map(item => [
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

    exportar();
  }*/

  function handleSelectAll() {
    const allChecked = Object.values(checkedState).every(Boolean);
    const newState = Object.fromEntries(
      Object.keys(checkedState).map(id => [id, !allChecked])
    );
    setCheckedState(newState);
  };

  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <h2>Usuarios</h2>
        <h2>{titulo}</h2>
        <h2>
          Horas restantes
          <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.30825 8C5.48325 8 5.63125 7.9395 5.75225 7.8185C5.87325 7.6975 5.93359 7.54967 5.93325 7.375C5.93292 7.20034 5.87259 7.05234 5.75225 6.931C5.63192 6.80967 5.48392 6.74934 5.30825 6.75C5.13259 6.75067 4.98475 6.81117 4.86475 6.9315C4.74475 7.05184 4.68425 7.19967 4.68325 7.375C4.68225 7.55034 4.74275 7.69834 4.86475 7.819C4.98675 7.93967 5.13459 8 5.30825 8ZM4.85825 6.075H5.78325C5.78325 5.8 5.81459 5.58334 5.87725 5.425C5.93992 5.26667 6.11692 5.05 6.40825 4.775C6.62492 4.55834 6.79575 4.352 6.92075 4.156C7.04575 3.96 7.10825 3.72467 7.10825 3.45C7.10825 2.98334 6.93742 2.625 6.59575 2.375C6.25409 2.125 5.84992 2 5.38325 2C4.90825 2 4.52292 2.125 4.22725 2.375C3.93159 2.625 3.72525 2.925 3.60825 3.275L4.43325 3.6C4.47492 3.45 4.56875 3.2875 4.71475 3.1125C4.86075 2.9375 5.08359 2.85 5.38325 2.85C5.64992 2.85 5.84992 2.923 5.98325 3.069C6.11659 3.215 6.18325 3.37534 6.18325 3.55C6.18325 3.71667 6.13325 3.873 6.03325 4.019C5.93325 4.165 5.80825 4.30034 5.65825 4.425C5.29159 4.75 5.06659 4.99584 4.98325 5.1625C4.89992 5.32917 4.85825 5.63334 4.85825 6.075ZM5.33325 10C4.64159 10 3.99159 9.86884 3.38325 9.6065C2.77492 9.34417 2.24575 8.98784 1.79575 8.5375C1.34575 8.08717 0.989586 7.558 0.727253 6.95C0.464919 6.342 0.333586 5.692 0.333253 5C0.332919 4.308 0.464253 3.658 0.727253 3.05C0.990253 2.442 1.34642 1.91284 1.79575 1.4625C2.24509 1.01217 2.77425 0.656003 3.38325 0.394003C3.99225 0.132003 4.64225 0.000669192 5.33325 2.52525e-06C6.02425 -0.000664141 6.67425 0.130669 7.28325 0.394003C7.89225 0.657336 8.42142 1.0135 8.87075 1.4625C9.32009 1.9115 9.67642 2.44067 9.93975 3.05C10.2031 3.65934 10.3343 4.30934 10.3333 5C10.3323 5.69067 10.2009 6.34067 9.93925 6.95C9.67759 7.55934 9.32142 8.0885 8.87075 8.5375C8.42009 8.9865 7.89092 9.34284 7.28325 9.6065C6.67559 9.87017 6.02559 10.0013 5.33325 10Z" fill="#252525" />
          </svg>
        </h2>
        <div>
          <h2>Total:</h2>
          <h2>{totalHorasTrabajadas}h</h2>
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="18" viewBox="0 0 14 14" fill="none" onClick={handleSelectAll} className={styles.svg}>
            <path d="M10.7981 6.17339C10.5967 6.17339 10.4335 6.33664 10.4335 6.53799V11.8854C10.4335 12.2204 10.1609 12.493 9.82581 12.493H2.04779C1.71272 12.493 1.44013 12.2204 1.44013 11.8854V4.10736C1.44013 3.77229 1.71272 3.4997 2.04779 3.4997H7.39518C7.59653 3.4997 7.75977 3.33646 7.75977 3.1351C7.75977 2.93375 7.59653 2.77051 7.39518 2.77051H2.04779C1.31065 2.77051 0.710938 3.37022 0.710938 4.10736V11.8854C0.710938 12.6225 1.31065 13.2222 2.04779 13.2222H9.82581C10.5629 13.2222 11.1627 12.6225 11.1627 11.8854V6.53799C11.1627 6.33664 10.9994 6.17339 10.7981 6.17339Z" fill="#B6BEC9" />
            <path d="M12.9065 1.7141L12.219 1.0266C11.8873 0.694911 11.3476 0.694911 11.0159 1.0266L5.516 6.52649C5.46511 6.57738 5.43042 6.64221 5.41627 6.71279L5.07251 8.43152C5.04862 8.55106 5.08602 8.67463 5.17224 8.76082C5.24129 8.82988 5.33431 8.86762 5.43003 8.86762C5.45383 8.86762 5.47775 8.86529 5.50152 8.86055L7.22024 8.51679C7.29083 8.50266 7.35565 8.46795 7.40655 8.41706L12.9065 2.91719C12.9065 2.91719 12.9065 2.91719 12.9065 2.91717C13.2381 2.58551 13.2381 2.04581 12.9065 1.7141ZM6.96901 7.8234L5.89482 8.03827L6.10969 6.96407L10.5862 2.4875L11.4456 3.34688L6.96901 7.8234ZM12.3909 2.40158L11.9612 2.83127L11.1018 1.97189L11.5315 1.54223C11.5789 1.49483 11.656 1.49481 11.7034 1.54221L12.3908 2.22971C12.4383 2.27708 12.4383 2.35421 12.3909 2.40158Z" fill="#B6BEC9" />
          </svg>
        </div>
      </div>
      {
        users.map((item, index) => {
          return <ReportesTableItem
            key={index}
            image={item.image}
            nombre={item.nombre}
            apellido={item.apellido}
            email={item.email}
            horas_semana={item.horas_semanales}
            horas_restantes={item.horas_restantes}
            id={item.id}
            checkedState={checkedState[item.id]}
            setCheckedState={setCheckedState}
          />

        })
      }
    </div>
  );
}