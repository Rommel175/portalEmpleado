'use client'

import styles from './comentarios.module.css';
import ComentarioContainer from "@/components/recursos/comentarios/ComentarioContainer";
import { useEffect, useState } from "react";
import ContainerOptions from "@/components/containers/ContainerOptions";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

type FichajeComentario = {
    fecha: Date;
    comentario: string;
};

type UserData = {
    id: string;
    nombre: string;
    apellido: string;
    fichajes: FichajeComentario[];
};

type PdfType = {
    nombre: string,
    apellido: string,
    fecha: string,
    comentario: string
}

export default function ComentariosPage() {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [option, setOption] = useState('Esta semana');
    const [usersData, setUsersData] = useState<UserData[]>([]);
    const [localizacion, setLocalizacion] = useState('all');
    const [reciente, setReciente] = useState(true);
    const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
    const [tipoRegistros, setTipoRegistros] = useState('all');

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
                checkedState: JSON.stringify(checkedState),
            });


            const res = await fetch(`/api/comentarios?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                console.error('Error en la respuesta:', res.status);
                return;
            }

            const result = await res.json();

            if (result.success) {
                setUsersData(result.usersData)
            }
        };

        fetchData();
    }, [option, reciente, checkedState]);

    function handleExportExcel() {
        const exportar = async () => {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Comentarios');

            worksheet.columns = [
                { header: 'Nombre', key: 'nombre', width: 25 },
                { header: 'Apellido', key: 'apellido', width: 25 },
                { header: 'Fecha', key: 'fecha', width: 65 },
                { header: 'Comentario', key: 'comentario', width: 80 }
            ];

            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });

            let currentRow = 2;

            usersData.forEach((user) => {
                user.fichajes.forEach((fichaje, index) => {
                    worksheet.getCell(`A${currentRow}`).value = index === 0 ? user.nombre ?? '' : '';
                    worksheet.getCell(`B${currentRow}`).value = index === 0 ? user.apellido ?? '' : '';
                    worksheet.getCell(`C${currentRow}`).value = new Date(fichaje.fecha).toString();
                    worksheet.getCell(`D${currentRow}`).value = fichaje.comentario;
                    currentRow++;
                });

                currentRow++;
            });

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            saveAs(blob, 'Comentarios.xlsx');
        };

        exportar();
    }

    function handleExportPdf() {
        const doc = new jsPDF();
        const headers = [['Nombre', 'Apellido', 'Fecha', 'Comentario']];

        const data: PdfType[] = [];

        usersData.forEach(user => {
            user.fichajes.forEach(fichaje => {
                data.push({
                    nombre: user.nombre ?? '',
                    apellido: user.apellido ?? '',
                    fecha: new Date(fichaje.fecha).toString(),
                    comentario: fichaje.comentario
                })
            });
        });

        doc.setFontSize(16);
        doc.text('Comentarios', 14, 20);

        autoTable(doc, {
            head: headers,
            body: data.map(item => [item.nombre, item.apellido, item.fecha, item.comentario]),
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
                2: { halign: 'center' },
                3: { cellWidth: 60 },
            },
            margin: { top: 10, bottom: 10 },
        });

        doc.save('comentarios.pdf');
    }

    return (
        <div className={styles.container}>
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
                    date={true}
                    usuarios={true}
                    recientes={true}
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
                usersData.length == 0 ? (
                    <p>No hay registros</p>
                ) : (
                    usersData.map((item, index) => {
                        return <ComentarioContainer key={index} nombre={item.nombre} apellido={item.apellido} fichajes={item.fichajes} />
                    })
                )

            }

        </div>
    );
}