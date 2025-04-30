import styles from './containerOptions.module.css'
import CustomDate from '../customDate/CustomDate';
import InputUsuarios from '../inputUsuarios/InputUsuarios';

type Prop = {
  recientes?: boolean,
  tipoRegistro?: boolean,
  ubicacion?: boolean,
  date?: boolean,
  usuarios?: boolean,
  startDate: Date | null,
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>,
  endDate: Date | null,
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>,
  option: string,
  setOption: React.Dispatch<React.SetStateAction<string>>,
  localizacion: string,
  setLocalizacion: React.Dispatch<React.SetStateAction<string>>
  reciente: boolean,
  setReciente: React.Dispatch<React.SetStateAction<boolean>>,
  checkedState: { [key: string]: boolean };
  setCheckedState: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;

}

export default function ContainerOptions({ recientes = false, tipoRegistro = false, ubicacion = false, date = false, usuarios = false, startDate, setStartDate, endDate, setEndDate, option, setOption, localizacion, setLocalizacion, reciente, setReciente, checkedState, setCheckedState }: Prop) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLocalizacion(e.target.value);
  }

  return (
    <div className={styles.filtros}>

      {
        (recientes) &&
        <div className={styles.recientes} onClick={() => reciente ? setReciente(false) : setReciente(true)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.36157 5.38037H10.3699V6.19704H4.36157V5.38037ZM4.36157 8.2387H10.3699V9.05537H4.36157V8.2387ZM4.76991 11.097H4.36157V11.9137H9.55324V11.097H4.76991ZM12.0032 12.4911L12.2919 12.2024L13.5169 10.9774L13.8056 10.6887L13.2282 10.1113L12.9395 10.4L12.4116 10.928V5.38037H11.5949V10.928L11.0669 10.4L10.7782 10.1113L10.2009 10.6887L10.4895 10.9774L11.7145 12.2024L12.0032 12.4911Z" fill="#7B8794" />
          </svg>
          <p>Más reciente</p>
        </div>
      }

      {
        (usuarios) &&
        <InputUsuarios checkedState={checkedState} setCheckedState={setCheckedState} />
      }

      {
        (tipoRegistro) &&

        <div className={styles.filtro}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_92_4640)">
              <path d="M12.6873 14H1.31226C0.586006 14 -0.000244141 13.4137 -0.000244141 12.6875V2.1875C-0.000244141 1.46125 0.586006 0.875 1.31226 0.875H12.6873C13.4135 0.875 13.9998 1.46125 13.9998 2.1875V12.6875C13.9998 13.4137 13.4135 14 12.6873 14ZM1.31226 1.75C1.06726 1.75 0.874756 1.9425 0.874756 2.1875V12.6875C0.874756 12.9325 1.06726 13.125 1.31226 13.125H12.6873C12.9323 13.125 13.1248 12.9325 13.1248 12.6875V2.1875C13.1248 1.9425 12.9323 1.75 12.6873 1.75H1.31226Z" fill="#7B8794" />
              <path d="M3.93726 3.5C3.69226 3.5 3.49976 3.3075 3.49976 3.0625V0.4375C3.49976 0.1925 3.69226 0 3.93726 0C4.18226 0 4.37476 0.1925 4.37476 0.4375V3.0625C4.37476 3.3075 4.18226 3.5 3.93726 3.5ZM10.0623 3.5C9.81726 3.5 9.62476 3.3075 9.62476 3.0625V0.4375C9.62476 0.1925 9.81726 0 10.0623 0C10.3073 0 10.4998 0.1925 10.4998 0.4375V3.0625C10.4998 3.3075 10.3073 3.5 10.0623 3.5ZM13.5623 5.25H0.437256C0.192256 5.25 -0.000244141 5.0575 -0.000244141 4.8125C-0.000244141 4.5675 0.192256 4.375 0.437256 4.375H13.5623C13.8073 4.375 13.9998 4.5675 13.9998 4.8125C13.9998 5.0575 13.8073 5.25 13.5623 5.25Z" fill="#7B8794" />
            </g>
            <defs>
              <clipPath id="clip0_92_4640">
                <rect width="14" height="14" fill="white" transform="translate(-0.000244141)" />
              </clipPath>
            </defs>
          </svg>

          <select name="filtro" id="filtro">
            <option value="0">Tipo de registro</option>
          </select>
        </div>
      }

      {
        (ubicacion) &&
        <div className={styles.filtro}>
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.0545 7.27579C13.0545 11.094 8.14542 14.3667 8.14542 14.3667C8.14542 14.3667 3.23633 11.094 3.23633 7.27579C3.23633 5.97382 3.75353 4.72517 4.67417 3.80454C5.5948 2.88391 6.84345 2.3667 8.14542 2.3667C9.44739 2.3667 10.696 2.88391 11.6167 3.80454C12.5373 4.72517 13.0545 5.97382 13.0545 7.27579Z" stroke="#7B8794" strokeWidth="0.818182" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.14542 8.91215C9.04916 8.91215 9.78178 8.17953 9.78178 7.27579C9.78178 6.37205 9.04916 5.63943 8.14542 5.63943C7.24168 5.63943 6.50906 6.37205 6.50906 7.27579C6.50906 8.17953 7.24168 8.91215 8.14542 8.91215Z" stroke="#7B8794" strokeWidth="0.818182" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <select name="location" id="location" value={localizacion} onChange={handleChange} >
            <option value="all">All</option>
            <option value="oficina">Oficina</option>
            <option value="casa">Casa</option>
            <option value="viaje">Viaje</option>
          </select>
        </div>
      }

      {
        (date) &&
        <CustomDate startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} option={option} setOption={setOption} />
      }
    </div>
  );
}
