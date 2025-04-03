import { User } from '@supabase/supabase-js';
import ContainerHeader from '../ContainerHeader';
//import ButtonsContainer from './ContainerButtons';
//import DateContainer from './ContainerDate';
import styles from './containerFichaje.module.css'
import ContainerTimer from './ContainerTimer';

export default function ContainerFichaje( {user}: {user:User} ) {
  const svg = (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.1113 18.8034C15.3596 18.8034 18.8036 15.3594 18.8036 11.1111C18.8036 6.86273 15.3596 3.41876 11.1113 3.41876C6.86291 3.41876 3.41895 6.86273 3.41895 11.1111C3.41895 15.3594 6.86291 18.8034 11.1113 18.8034Z"
        stroke="#0B3C70"
        strokeWidth="1.28742"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2566 7.69189V11.9654H14.5301"
        stroke="#0B3C70"
        strokeWidth="1.28742"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  return (
    <div className={styles.container}>
      <ContainerHeader name={'Fichar'} svg={svg} />
      <div className={styles.content}>
        <ContainerTimer user={user}/>
      </div>
    </div>
  );
}