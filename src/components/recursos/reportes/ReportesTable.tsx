'use client'

import Tooltips from '@/components/tooltip/Tooltips';
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
        <h2>Usuario</h2>
        <h2>{titulo}</h2>
        <h2>
          Horas restantes
          <Tooltips infoText='Horas restantes del usuario'>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.97506 9C6.15006 9 6.29806 8.9395 6.41906 8.8185C6.54006 8.6975 6.60039 8.54967 6.60006 8.375C6.59973 8.20034 6.53939 8.05234 6.41906 7.931C6.29873 7.80967 6.15073 7.74934 5.97506 7.75C5.79939 7.75067 5.65156 7.81117 5.53156 7.9315C5.41156 8.05184 5.35106 8.19967 5.35006 8.375C5.34906 8.55034 5.40956 8.69834 5.53156 8.819C5.65356 8.93967 5.80139 9 5.97506 9ZM5.52506 7.075H6.45006C6.45006 6.8 6.48139 6.58334 6.54406 6.425C6.60673 6.26667 6.78373 6.05 7.07506 5.775C7.29173 5.55834 7.46256 5.352 7.58756 5.156C7.71256 4.96 7.77506 4.72467 7.77506 4.45C7.77506 3.98334 7.60423 3.625 7.26256 3.375C6.92089 3.125 6.51673 3 6.05006 3C5.57506 3 5.18973 3.125 4.89406 3.375C4.5984 3.625 4.39206 3.925 4.27506 4.275L5.10006 4.6C5.14173 4.45 5.23556 4.2875 5.38156 4.1125C5.52756 3.9375 5.75039 3.85 6.05006 3.85C6.31673 3.85 6.51673 3.923 6.65006 4.069C6.78339 4.215 6.85006 4.37534 6.85006 4.55C6.85006 4.71667 6.80006 4.873 6.70006 5.019C6.60006 5.165 6.47506 5.30034 6.32506 5.425C5.95839 5.75 5.7334 5.99584 5.65006 6.1625C5.56673 6.32917 5.52506 6.63334 5.52506 7.075ZM6.00006 11C5.30839 11 4.6584 10.8688 4.05006 10.6065C3.44173 10.3442 2.91256 9.98784 2.46256 9.5375C2.01256 9.08717 1.6564 8.558 1.39406 7.95C1.13173 7.342 1.0004 6.692 1.00006 6C0.999728 5.308 1.13106 4.658 1.39406 4.05C1.65706 3.442 2.01323 2.91284 2.46256 2.4625C2.9119 2.01217 3.44106 1.656 4.05006 1.394C4.65906 1.132 5.30906 1.00067 6.00006 1C6.69106 0.999336 7.34106 1.13067 7.95006 1.394C8.55906 1.65734 9.08823 2.0135 9.53756 2.4625C9.9869 2.9115 10.3432 3.44067 10.6066 4.05C10.8699 4.65934 11.0011 5.30934 11.0001 6C10.9991 6.69067 10.8677 7.34067 10.6061 7.95C10.3444 8.55934 9.98823 9.0885 9.53756 9.5375C9.0869 9.9865 8.55773 10.3428 7.95006 10.6065C7.34239 10.8702 6.69239 11.0013 6.00006 11Z" fill="#285FF5" />
            </svg>
          </Tooltips>

        </h2>

        <div className={styles.totalHoras}>
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