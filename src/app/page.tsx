
//import NavComponent from '@/components/nav/NavComponent';
import styles from './page.module.css';
import { Roboto } from 'next/font/google';

const roboto = Roboto ({
  weight: ['600'],
  subsets: ['latin'],
})

export default function HomePage() {
  return (
    <main className={`${styles.main} ${roboto.className}`}>
      <h1>dsdsd</h1>
    </main>
  );
}
