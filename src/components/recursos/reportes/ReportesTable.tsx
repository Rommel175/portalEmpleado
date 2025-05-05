'use client'

import styles from './reportesTable.module.css'
import ReportesTableItem from './ReportesTableItem';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

type UserData = {
  id: string,
  nombre: string,
  apellido: string,
  email: string
  image: string,
  horas_semanales: string,
  horas_restantes: string
}

export default function ReportesTable({ users, totalHorasTrabajadas }: { users: UserData[], totalHorasTrabajadas: string }) {

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
  }




  return (
    <div className={styles.table}>
      <div className={styles.tableHeader}>
        <h2>Usuarios</h2>
        <h2>Horas semanales</h2>
        <h2>
          Horas restantes
          <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.30825 8C5.48325 8 5.63125 7.9395 5.75225 7.8185C5.87325 7.6975 5.93359 7.54967 5.93325 7.375C5.93292 7.20034 5.87259 7.05234 5.75225 6.931C5.63192 6.80967 5.48392 6.74934 5.30825 6.75C5.13259 6.75067 4.98475 6.81117 4.86475 6.9315C4.74475 7.05184 4.68425 7.19967 4.68325 7.375C4.68225 7.55034 4.74275 7.69834 4.86475 7.819C4.98675 7.93967 5.13459 8 5.30825 8ZM4.85825 6.075H5.78325C5.78325 5.8 5.81459 5.58334 5.87725 5.425C5.93992 5.26667 6.11692 5.05 6.40825 4.775C6.62492 4.55834 6.79575 4.352 6.92075 4.156C7.04575 3.96 7.10825 3.72467 7.10825 3.45C7.10825 2.98334 6.93742 2.625 6.59575 2.375C6.25409 2.125 5.84992 2 5.38325 2C4.90825 2 4.52292 2.125 4.22725 2.375C3.93159 2.625 3.72525 2.925 3.60825 3.275L4.43325 3.6C4.47492 3.45 4.56875 3.2875 4.71475 3.1125C4.86075 2.9375 5.08359 2.85 5.38325 2.85C5.64992 2.85 5.84992 2.923 5.98325 3.069C6.11659 3.215 6.18325 3.37534 6.18325 3.55C6.18325 3.71667 6.13325 3.873 6.03325 4.019C5.93325 4.165 5.80825 4.30034 5.65825 4.425C5.29159 4.75 5.06659 4.99584 4.98325 5.1625C4.89992 5.32917 4.85825 5.63334 4.85825 6.075ZM5.33325 10C4.64159 10 3.99159 9.86884 3.38325 9.6065C2.77492 9.34417 2.24575 8.98784 1.79575 8.5375C1.34575 8.08717 0.989586 7.558 0.727253 6.95C0.464919 6.342 0.333586 5.692 0.333253 5C0.332919 4.308 0.464253 3.658 0.727253 3.05C0.990253 2.442 1.34642 1.91284 1.79575 1.4625C2.24509 1.01217 2.77425 0.656003 3.38325 0.394003C3.99225 0.132003 4.64225 0.000669192 5.33325 2.52525e-06C6.02425 -0.000664141 6.67425 0.130669 7.28325 0.394003C7.89225 0.657336 8.42142 1.0135 8.87075 1.4625C9.32009 1.9115 9.67642 2.44067 9.93975 3.05C10.2031 3.65934 10.3343 4.30934 10.3333 5C10.3323 5.69067 10.2009 6.34067 9.93925 6.95C9.67759 7.55934 9.32142 8.0885 8.87075 8.5375C8.42009 8.9865 7.89092 9.34284 7.28325 9.6065C6.67559 9.87017 6.02559 10.0013 5.33325 10Z" fill="#252525" />
          </svg>
        </h2>
        <div>
          <h2>Total:</h2>
          <h2>{totalHorasTrabajadas}h</h2>
          <svg width="150" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleExportExcel}>
            <path d="M14.395 8.46648V14.124C14.395 14.3741 14.2922 14.6139 14.1094 14.7907C13.9265 14.9676 13.6785 15.0669 13.4199 15.0669H4.64404C4.38543 15.0669 4.13741 14.9676 3.95454 14.7907C3.77168 14.6139 3.66895 14.3741 3.66895 14.124V8.46648C3.66895 8.2164 3.77168 7.97657 3.95454 7.79973C4.13741 7.6229 4.38543 7.52356 4.64404 7.52356H6.10668C6.23598 7.52356 6.35999 7.57323 6.45143 7.66165C6.54286 7.75006 6.59423 7.86998 6.59423 7.99502C6.59423 8.12006 6.54286 8.23997 6.45143 8.32839C6.35999 8.41681 6.23598 8.46648 6.10668 8.46648H4.64404V14.124H13.4199V8.46648H11.9572C11.8279 8.46648 11.7039 8.41681 11.6125 8.32839C11.5211 8.23997 11.4697 8.12006 11.4697 7.99502C11.4697 7.86998 11.5211 7.75006 11.6125 7.66165C11.7039 7.57323 11.8279 7.52356 11.9572 7.52356H13.4199C13.6785 7.52356 13.9265 7.6229 14.1094 7.79973C14.2922 7.97657 14.395 8.2164 14.395 8.46648ZM6.93917 5.97128L8.54441 4.41841V9.88086C8.54441 10.0059 8.59578 10.1258 8.68721 10.2142C8.77864 10.3026 8.90265 10.3523 9.03196 10.3523C9.16126 10.3523 9.28527 10.3026 9.37671 10.2142C9.46814 10.1258 9.51951 10.0059 9.51951 9.88086V4.41841L11.1248 5.97128C11.2162 6.05974 11.3403 6.10944 11.4697 6.10944C11.5991 6.10944 11.7231 6.05974 11.8146 5.97128C11.9061 5.88281 11.9575 5.76283 11.9575 5.63772C11.9575 5.51261 11.9061 5.39263 11.8146 5.30416L9.3769 2.94687C9.33162 2.90303 9.27785 2.86826 9.21866 2.84453C9.15947 2.82081 9.09603 2.80859 9.03196 2.80859C8.96789 2.80859 8.90445 2.82081 8.84526 2.84453C8.78607 2.86826 8.7323 2.90303 8.68702 2.94687L6.24929 5.30416C6.1578 5.39263 6.10641 5.51261 6.10641 5.63772C6.10641 5.76283 6.1578 5.88281 6.24929 5.97128C6.34077 6.05974 6.46485 6.10944 6.59423 6.10944C6.7236 6.10944 6.84768 6.05974 6.93917 5.97128Z" fill="#9C9FA1" />
          </svg>
        </div>
      </div>
      {
        users.map((item, index) => {
          return <ReportesTableItem key={index} image={item.image} nombre={item.nombre} apellido={item.apellido} email={item.email} horas_semana={item.horas_semanales} horas_restantes={item.horas_restantes} id={item.id} />
        })
      }
    </div>
  );
}