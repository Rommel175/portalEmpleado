'use client'

import ComentariosCard from '@/components/recursos/comentarios/ComentariosCard';
import styles from './comentarios.module.css';
import { useEffect, useState } from "react";
import Loading from '@/components/loading/Loading';
//import ContainerOptions from "@/components/containers/ContainerOptions";

type FichajeComentario = {
    fecha: Date,
    comentario: string
};

type UserData = {
    id: string,
    nombre: string,
    apellido: string,
    email: string,
    image: string,
    fichajes: FichajeComentario[]
};

export default function ComentariosPage() {
    //const [startDate, setStartDate] = useState<Date | null>(null);
    //const [endDate, setEndDate] = useState<Date | null>(null);
    //const [option, setOption] = useState('Esta semana');
    //const [localizacion, setLocalizacion] = useState('all');
    //const [reciente, setReciente] = useState(true);
    //const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});
    //const [checkedStateRegistro, setCheckedStateRegistro] = useState<{ [key: string]: boolean }>({});
    const [usersData, setUsersData] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        /*let start = startDate;
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
        }*/

        const fetchData = async () => {
            /*const params = new URLSearchParams({
                option: option,
                //startDate: start ? start.toISOString() : '',
                //endDate: end ? end.toISOString() : '',
                reciente: reciente.toString(),
                localizacion: localizacion,
                checkedState: JSON.stringify(checkedState),
            });*/

            setIsLoading(true);

            try {
                const res = await fetch(`/api/comentarios`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!res.ok) {
                    console.error('Error en la respuesta:', res.status);
                    return;
                }

                const result = await res.json();

                if (result.success) {
                    setUsersData(result.usersData);
                }
            } catch (error) {
                console.log('Error catga de datos: ', error);
            } finally {
                setIsLoading(false);
            }

        };

        fetchData();
    }, []);


    /*function handleExportExcel() {
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
    }*/

    /*function handleExportPdf() {
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
    }*/

    return (
        <div className={styles.container}>
            {
                /*<div className={styles.options}>
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
                        checkedStateRegistro={checkedStateRegistro}
                        setCheckedStateRegistro={setCheckedStateRegistro}
                    />
                </div>*/
            }

            {
                (isLoading) &&
                <Loading />
            }

            {
                !isLoading && usersData.length == 0 ? (
                    <p>No hay comentarios</p>
                ) :
                    usersData.map((user, userIndex) =>
                        user.fichajes.map((fichaje, fichajeIndex) => (
                            <ComentariosCard
                                key={`${userIndex}-${fichajeIndex}`}
                                nombre={user.nombre}
                                apellido={user.apellido}
                                email={user.email}
                                image={user.image}
                                fichajes={fichaje}
                            />
                        ))
                    )

            }




        </div>
    );
}