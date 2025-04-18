import ContainerHeader from '../ContainerHeader';
import styles from './containerEquipo.module.css'
import ContainerTable from './ContainerTable';
import { Equipo } from '@/types/Types';

export default function ContainerEquipo( {equipo} : {equipo: Equipo[]} ) {
    console.log(equipo);
    const svg = (
        <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M16.0002 17.2224V19.2224H2.00024V17.2224C2.00024 17.2224 2.00024 13.2224 9.00024 13.2224C16.0002 13.2224 16.0002 17.2224 16.0002 17.2224ZM12.5002 7.72245C12.5002 7.03021 12.295 6.35353 11.9104 5.77795C11.5258 5.20238 10.9792 4.75378 10.3396 4.48887C9.70009 4.22396 8.99636 4.15465 8.31743 4.2897C7.63849 4.42475 7.01485 4.75809 6.52537 5.24758C6.03589 5.73706 5.70254 6.3607 5.5675 7.03963C5.43245 7.71857 5.50176 8.4223 5.76667 9.06184C6.03157 9.70138 6.48018 10.248 7.05575 10.6326C7.63132 11.0172 8.30801 11.2224 9.00024 11.2224C9.9285 11.2224 10.8187 10.8537 11.4751 10.1973C12.1315 9.54094 12.5002 8.65071 12.5002 7.72245ZM15.9402 13.2224C16.555 13.6982 17.058 14.3029 17.4139 14.994C17.7698 15.685 17.97 16.4457 18.0002 17.2224V19.2224H22.0002V17.2224C22.0002 17.2224 22.0002 13.5924 15.9402 13.2224ZM15.0002 4.22245C14.312 4.21925 13.639 4.42498 13.0702 4.81245C13.6777 5.66119 14.0043 6.67873 14.0043 7.72245C14.0043 8.76616 13.6777 9.78371 13.0702 10.6324C13.639 11.0199 14.312 11.2256 15.0002 11.2224C15.9285 11.2224 16.8187 10.8537 17.4751 10.1973C18.1315 9.54094 18.5002 8.65071 18.5002 7.72245C18.5002 6.79419 18.1315 5.90395 17.4751 5.24758C16.8187 4.5912 15.9285 4.22245 15.0002 4.22245Z"
                fill="#0B3C70"
            />
        </svg>

    )

    return (
        <div className={styles.container}>
            <ContainerHeader name='Equipo' svg={svg} />
            <div className={styles.content}>
                <ContainerTable equipo={equipo} />
            </div>
        </div>
    );
}