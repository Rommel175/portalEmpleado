import Link from 'next/link';
import styles from './containerOptions.module.css'
import CustomDate from '../customDate/CustomDate';
import InputUsuarios from '../inputUsuarios/InputUsuarios';

type Prop = {
  exportar?: boolean,
  recientes?: boolean,
  tipoRegistro?: boolean,
  ubicacion?: boolean,
  date?: boolean,
  urlExportar?: string,
  usuarios?: boolean,
  añadirUsuario?: boolean,
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

export default function ContainerOptions({ exportar = false, recientes = false, tipoRegistro = false, ubicacion = false, date = false, urlExportar, usuarios = false, añadirUsuario = false, startDate, setStartDate, endDate, setEndDate, option, setOption, localizacion, setLocalizacion, reciente, setReciente, checkedState, setCheckedState }: Prop) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setLocalizacion(e.target.value);
  }

  return (
    <div className={styles.options}>
      {
        (exportar) &&
        <Link href={urlExportar || '#'}>
          <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.395 8.68889V14.3464C14.395 14.5965 14.2922 14.8363 14.1094 15.0131C13.9265 15.19 13.6785 15.2893 13.4199 15.2893H4.64404C4.38543 15.2893 4.13741 15.19 3.95454 15.0131C3.77168 14.8363 3.66895 14.5965 3.66895 14.3464V8.68889C3.66895 8.43881 3.77168 8.19898 3.95454 8.02215C4.13741 7.84531 4.38543 7.74597 4.64404 7.74597H6.10668C6.23598 7.74597 6.35999 7.79564 6.45143 7.88406C6.54286 7.97247 6.59423 8.09239 6.59423 8.21743C6.59423 8.34247 6.54286 8.46239 6.45143 8.5508C6.35999 8.63922 6.23598 8.68889 6.10668 8.68889H4.64404V14.3464H13.4199V8.68889H11.9572C11.8279 8.68889 11.7039 8.63922 11.6125 8.5508C11.5211 8.46239 11.4697 8.34247 11.4697 8.21743C11.4697 8.09239 11.5211 7.97247 11.6125 7.88406C11.7039 7.79564 11.8279 7.74597 11.9572 7.74597H13.4199C13.6785 7.74597 13.9265 7.84531 14.1094 8.02215C14.2922 8.19898 14.395 8.43881 14.395 8.68889ZM6.93917 6.19369L8.54441 4.64082V10.1033C8.54441 10.2283 8.59578 10.3482 8.68721 10.4366C8.77864 10.5251 8.90265 10.5747 9.03196 10.5747C9.16126 10.5747 9.28527 10.5251 9.37671 10.4366C9.46814 10.3482 9.51951 10.2283 9.51951 10.1033V4.64082L11.1248 6.19369C11.2162 6.28216 11.3403 6.33185 11.4697 6.33185C11.5991 6.33185 11.7231 6.28216 11.8146 6.19369C11.9061 6.10523 11.9575 5.98524 11.9575 5.86013C11.9575 5.73502 11.9061 5.61504 11.8146 5.52658L9.3769 3.16928C9.33162 3.12544 9.27785 3.09067 9.21866 3.06694C9.15947 3.04322 9.09603 3.03101 9.03196 3.03101C8.96789 3.03101 8.90445 3.04322 8.84526 3.06694C8.78607 3.09067 8.7323 3.12544 8.68702 3.16928L6.24929 5.52658C6.1578 5.61504 6.10641 5.73502 6.10641 5.86013C6.10641 5.98524 6.1578 6.10523 6.24929 6.19369C6.34077 6.28216 6.46485 6.33185 6.59423 6.33185C6.7236 6.33185 6.84768 6.28216 6.93917 6.19369Z" fill="#285FF5" />
          </svg>
          Exportar valores
        </Link>
      }

      {
        (añadirUsuario) &&
        <button className={styles.addUser}>
          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.99996 2.6665C8.13257 2.6665 8.25974 2.71918 8.35351 2.81295C8.44728 2.90672 8.49996 3.0339 8.49996 3.1665V7.99984H13.3333C13.4659 7.99984 13.5931 8.05252 13.6868 8.14628C13.7806 8.24005 13.8333 8.36723 13.8333 8.49984C13.8333 8.63245 13.7806 8.75962 13.6868 8.85339C13.5931 8.94716 13.4659 8.99984 13.3333 8.99984H8.49996V13.8332C8.49996 13.9658 8.44728 14.093 8.35351 14.1867C8.25974 14.2805 8.13257 14.3332 7.99996 14.3332C7.86735 14.3332 7.74017 14.2805 7.64641 14.1867C7.55264 14.093 7.49996 13.9658 7.49996 13.8332V8.99984H2.66663C2.53402 8.99984 2.40684 8.94716 2.31307 8.85339C2.2193 8.75962 2.16663 8.63245 2.16663 8.49984C2.16663 8.36723 2.2193 8.24005 2.31307 8.14628C2.40684 8.05252 2.53402 7.99984 2.66663 7.99984H7.49996V3.1665C7.49996 3.0339 7.55264 2.90672 7.64641 2.81295C7.74017 2.71918 7.86735 2.6665 7.99996 2.6665Z" fill="white" />
          </svg>
          Añadir Usuario
        </button>
      }

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
          <InputUsuarios checkedState={checkedState} setCheckedState={setCheckedState}/>
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

    </div>
  );
}