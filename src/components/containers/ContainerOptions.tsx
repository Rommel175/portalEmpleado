import Link from 'next/link';
import styles from './containerOptions.module.css'

type Prop = {
  exportar?: boolean,
  recientes?: boolean,
  tipoRegistro?: boolean,
  ubicacion?: boolean,
  semanal?: boolean,
  urlExportar: string 
}

export default function ContainerOptions({ exportar = true, recientes = true, tipoRegistro = true, ubicacion = true, semanal = true, urlExportar }: Prop) {
  return (
    <div className={styles.options}>
      {
        (exportar) &&
        <Link href={urlExportar}>
          <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.395 8.68889V14.3464C14.395 14.5965 14.2922 14.8363 14.1094 15.0131C13.9265 15.19 13.6785 15.2893 13.4199 15.2893H4.64404C4.38543 15.2893 4.13741 15.19 3.95454 15.0131C3.77168 14.8363 3.66895 14.5965 3.66895 14.3464V8.68889C3.66895 8.43881 3.77168 8.19898 3.95454 8.02215C4.13741 7.84531 4.38543 7.74597 4.64404 7.74597H6.10668C6.23598 7.74597 6.35999 7.79564 6.45143 7.88406C6.54286 7.97247 6.59423 8.09239 6.59423 8.21743C6.59423 8.34247 6.54286 8.46239 6.45143 8.5508C6.35999 8.63922 6.23598 8.68889 6.10668 8.68889H4.64404V14.3464H13.4199V8.68889H11.9572C11.8279 8.68889 11.7039 8.63922 11.6125 8.5508C11.5211 8.46239 11.4697 8.34247 11.4697 8.21743C11.4697 8.09239 11.5211 7.97247 11.6125 7.88406C11.7039 7.79564 11.8279 7.74597 11.9572 7.74597H13.4199C13.6785 7.74597 13.9265 7.84531 14.1094 8.02215C14.2922 8.19898 14.395 8.43881 14.395 8.68889ZM6.93917 6.19369L8.54441 4.64082V10.1033C8.54441 10.2283 8.59578 10.3482 8.68721 10.4366C8.77864 10.5251 8.90265 10.5747 9.03196 10.5747C9.16126 10.5747 9.28527 10.5251 9.37671 10.4366C9.46814 10.3482 9.51951 10.2283 9.51951 10.1033V4.64082L11.1248 6.19369C11.2162 6.28216 11.3403 6.33185 11.4697 6.33185C11.5991 6.33185 11.7231 6.28216 11.8146 6.19369C11.9061 6.10523 11.9575 5.98524 11.9575 5.86013C11.9575 5.73502 11.9061 5.61504 11.8146 5.52658L9.3769 3.16928C9.33162 3.12544 9.27785 3.09067 9.21866 3.06694C9.15947 3.04322 9.09603 3.03101 9.03196 3.03101C8.96789 3.03101 8.90445 3.04322 8.84526 3.06694C8.78607 3.09067 8.7323 3.12544 8.68702 3.16928L6.24929 5.52658C6.1578 5.61504 6.10641 5.73502 6.10641 5.86013C6.10641 5.98524 6.1578 6.10523 6.24929 6.19369C6.34077 6.28216 6.46485 6.33185 6.59423 6.33185C6.7236 6.33185 6.84768 6.28216 6.93917 6.19369Z" fill="#285FF5" />
          </svg>
          Exportar valores
        </Link>
      }

      <div className={styles.filtros}>

        {
          (recientes) &&
          <div className={styles.recientes}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.36157 5.38037H10.3699V6.19704H4.36157V5.38037ZM4.36157 8.2387H10.3699V9.05537H4.36157V8.2387ZM4.76991 11.097H4.36157V11.9137H9.55324V11.097H4.76991ZM12.0032 12.4911L12.2919 12.2024L13.5169 10.9774L13.8056 10.6887L13.2282 10.1113L12.9395 10.4L12.4116 10.928V5.38037H11.5949V10.928L11.0669 10.4L10.7782 10.1113L10.2009 10.6887L10.4895 10.9774L11.7145 12.2024L12.0032 12.4911Z" fill="#7B8794" />
            </svg>
            <p>Más reciente</p>
          </div>
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

            <select name="location" id="location">
              <option value="0">Ubicación</option>
            </select>
          </div>
        }

        {
          (semanal) &&
          <div className={styles.filtro}>
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_203_16908)">
                <path d="M12.6875 14.5H1.3125C0.58625 14.5 0 13.9137 0 13.1875V2.6875C0 1.96125 0.58625 1.375 1.3125 1.375H12.6875C13.4137 1.375 14 1.96125 14 2.6875V13.1875C14 13.9137 13.4137 14.5 12.6875 14.5ZM1.3125 2.25C1.0675 2.25 0.875 2.4425 0.875 2.6875V13.1875C0.875 13.4325 1.0675 13.625 1.3125 13.625H12.6875C12.9325 13.625 13.125 13.4325 13.125 13.1875V2.6875C13.125 2.4425 12.9325 2.25 12.6875 2.25H1.3125Z" fill="#7B8794" />
                <path d="M3.9375 4C3.6925 4 3.5 3.8075 3.5 3.5625V0.9375C3.5 0.6925 3.6925 0.5 3.9375 0.5C4.1825 0.5 4.375 0.6925 4.375 0.9375V3.5625C4.375 3.8075 4.1825 4 3.9375 4ZM10.0625 4C9.8175 4 9.625 3.8075 9.625 3.5625V0.9375C9.625 0.6925 9.8175 0.5 10.0625 0.5C10.3075 0.5 10.5 0.6925 10.5 0.9375V3.5625C10.5 3.8075 10.3075 4 10.0625 4ZM13.5625 5.75H0.4375C0.1925 5.75 0 5.5575 0 5.3125C0 5.0675 0.1925 4.875 0.4375 4.875H13.5625C13.8075 4.875 14 5.0675 14 5.3125C14 5.5575 13.8075 5.75 13.5625 5.75Z" fill="#7B8794" />
              </g>
              <defs>
                <clipPath id="clip0_203_16908">
                  <rect width="14" height="14" fill="white" transform="translate(0 0.5)" />
                </clipPath>
              </defs>
            </svg>

            <select name="date" id="date">
              <option value="0">semanal</option>
              <option value="0">mensual</option>
            </select>
          </div>
        }

      </div>

    </div>
  );
}