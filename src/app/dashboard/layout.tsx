import SidebarComponent from '@/components/sidebar/SidebarComponent';
import styles from './layout.module.css';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['600', '400', '500'],
  subsets: ['latin']
})

export default function DashboardLayout({
 children
}: {
 children: React.ReactNode;
}) {
  return (
    <div className={`${styles.wraper} ${roboto.className}`}>
      <SidebarComponent />
      {children}
    </div>
  );
}